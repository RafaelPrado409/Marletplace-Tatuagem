/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { QueryArtistsDto } from './dto/query-artists.dto.js';
import { CreateArtistDto } from './dto/create-artist.dto.js';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryArtistsDto) {
    const { city, style, q, page = 1, size = 12 } = query;

    const where: any = {};

    if (q) {
      where.OR = [
        { displayName: { contains: q, mode: 'insensitive' } },
        { bio: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (city) {
      where.studio = { city: { equals: city, mode: 'insensitive' } };
    }

    if (style) {
      where.styles = { some: { style: { slug: style } } };
    }

    if (query.studioId) {
      where.studioId = query.studioId;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.artist.findMany({
        where,
        include: { studio: true, styles: { include: { style: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * size,
        take: size,
      }),
      this.prisma.artist.count({ where }),
    ]);

    return { page, size, total, items };
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        studio: true,
        styles: { include: { style: true } },
        portfolio: true,
      },
    });
    if (!artist) throw new Error('Artist not found');
    return artist;
  }

  async create(dto: CreateArtistDto) {
    const studio = await this.prisma.studio.findUnique({
      where: { id: dto.studioId },
    });
    if (!studio) throw new NotFoundException('Studio not found');

    let styleLinks: { artistId: string; styleId: string }[] = [];
    if (dto.styles && dto.styles.length) {
      const styles = await this.prisma.style.findMany({
        where: { slug: { in: dto.styles } },
      });
      const slugsEncontrados = new Set(styles.map((s) => s.slug));
      const faltando = dto.styles.filter((s) => !slugsEncontrados.has(s));
      if (faltando.length) {
        throw new BadRequestException(
          `Estilos inexistentes: ${faltando.join(', ')}`,
        );
      }
      styleLinks = styles.map((s) => ({ artistId: '', styleId: s.id }));
    }

    return this.prisma.$transaction(async (tx) => {
      const artist = await tx.artist.create({
        data: {
          studioId: dto.studioId,
          displayName: dto.displayName,
          bio: dto.bio,
          instagram: dto.instagram,
        },
      });

      if (styleLinks.length) {
        await tx.artistStyle.createMany({
          data: styleLinks.map((l) => ({
            artistId: artist.id,
            styleId: l.styleId,
          })),
          skipDuplicates: true,
        });
      }

      return tx.artist.findUnique({
        where: { id: artist.id },
        include: { studio: true, styles: { include: { style: true } } },
      });
    });
  }
}
