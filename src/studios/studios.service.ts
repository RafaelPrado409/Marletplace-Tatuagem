/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateStudioDto } from './dto/create-studio.dto.js';
import { UpdateStudioDto } from './dto/update-studio.dto.js';
import { AddArtistToStudioDto } from './dto/add-artists.dto.js';
import { AddArtistByUserIdDto } from './dto/add-artist-by-user-id.dto.js';
import { UpdateArtistInStudioDto } from './dto/update-artist-in-studio.dto.js';

import { Role } from '../../generated/client/client.js';

@Injectable()
export class StudiosService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: { q?: string; city?: string; state?: string }) {
    const { q, city, state } = params ?? {};

    return this.prisma.studio.findMany({
      where: {
        OR: q
          ? [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { city: { contains: q, mode: 'insensitive' } },
            ]
          : undefined,

        city: city ? { contains: city, mode: 'insensitive' } : undefined,

        state: state || undefined,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const studio = await this.prisma.studio.findUnique({ where: { id } });
    if (!studio) throw new NotFoundException('Studio not found');
    return studio;
  }

  async create(dto: CreateStudioDto) {
    try {
      return await this.prisma.studio.create({ data: dto });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new ConflictException('Unique constraint violation');
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateStudioDto) {
    try {
      return await this.prisma.studio.update({ where: { id }, data: dto });
    } catch (e: any) {
      if (e.code === 'P2025') throw new NotFoundException('Studio not found');
      if (e.code === 'P2002')
        throw new ConflictException('Unique constraint violation');
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.studio.delete({ where: { id } });
    } catch (e: any) {
      if (e.code === 'P2025') throw new NotFoundException('Studio not found');
      throw e;
    }
  }

  async findByOwner(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Usuário inválido ao buscar estúdios.');
    }

    return this.prisma.studio.findMany({
      where: { ownerId: userId },
    });
  }

  async createForOwner(userId: string, dto: CreateStudioDto) {
    if (!userId) {
      throw new UnauthorizedException('Usuário inválido ao criar estúdio.');
    }

    const existing = await this.prisma.studio.findFirst({
      where: { ownerId: userId },
    });

    if (existing) {
      throw new ForbiddenException('Você já possui um estúdio cadastrado.');
    }

    return this.prisma.studio.create({
      data: {
        ...dto,
        ownerId: userId,
      },
    });
  }

  async findMyStudios(userId: string) {
    return this.prisma.studio.findMany({
      where: { ownerId: userId },
      include: {
        artists: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  private async assertOwnership(studioId: string, userId: string) {
    const studio = await this.prisma.studio.findUnique({
      where: { id: studioId },
    });

    if (!studio) {
      throw new NotFoundException('Estúdio não encontrado.');
    }

    if (studio.ownerId !== userId) {
      throw new ForbiddenException('Você não é o dono deste estúdio.');
    }

    return studio;
  }

  async addArtistToStudio(
    studioId: string,
    ownerId: string,
    dto: AddArtistToStudioDto,
  ) {
    await this.assertOwnership(studioId, ownerId);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.userEmail },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user.role === Role.CLIENT) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { role: Role.ARTIST },
      });
    }

    let artist = await this.prisma.artist.findFirst({
      where: { userId: user.id },
    });

    if (!artist) {
      artist = await this.prisma.artist.create({
        data: {
          userId: user.id,
          studioId,
          displayName: dto.displayName,
          bio: dto.bio,
          instagram: dto.instagram,
        },
      });
    } else {
      artist = await this.prisma.artist.update({
        where: { id: artist.id },
        data: {
          studioId,
          displayName: dto.displayName ?? artist.displayName,
          bio: dto.bio ?? artist.bio,
          instagram: dto.instagram ?? artist.instagram,
        },
      });
    }

    return artist;
  }

  async removeArtistFromStudio(
    studioId: string,
    ownerId: string,
    artistId: string,
  ) {
    await this.assertOwnership(studioId, ownerId);

    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!artist || artist.studioId !== studioId) {
      throw new NotFoundException('Artista não pertence a este estúdio.');
    }

    return this.prisma.artist.delete({
      where: { id: artistId },
    });
  }

  async findAvailableArtistsForOwner(ownerId: string) {
    if (!ownerId) {
      throw new UnauthorizedException('Usuário inválido.');
    }

    const studio = await this.prisma.studio.findFirst({
      where: { ownerId },
    });

    if (!studio) {
      throw new ForbiddenException('Você ainda não possui estúdio cadastrado.');
    }

    const artists = await this.prisma.user.findMany({
      where: {
        role: Role.ARTIST,
        artists: {
          none: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: 'asc' },
    });

    return { studioId: studio.id, artists };
  }

  async addArtistToStudioByUserId(
    studioId: string,
    ownerId: string,
    dto: AddArtistByUserIdDto,
  ) {
    await this.assertOwnership(studioId, ownerId);

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user.role !== Role.ARTIST) {
      throw new ForbiddenException('Usuário não possui papel de artista.');
    }

    let artist = await this.prisma.artist.findFirst({
      where: { userId: user.id },
    });

    if (!artist) {
      artist = await this.prisma.artist.create({
        data: {
          userId: user.id,
          studioId,
          displayName: dto.displayName ?? user.name,
          bio: dto.bio ?? null,
          instagram: dto.instagram ?? null,
        },
      });
    } else {
      artist = await this.prisma.artist.update({
        where: { id: artist.id },
        data: {
          studioId,
          displayName: dto.displayName ?? artist.displayName ?? user.name,
          bio: dto.bio ?? artist.bio,
          instagram: dto.instagram ?? artist.instagram,
        },
      });
    }

    return artist;
  }

  async updateArtistInStudio(
    studioId: string,
    ownerId: string,
    artistId: string,
    dto: UpdateArtistInStudioDto,
  ) {
    await this.assertOwnership(studioId, ownerId);

    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!artist || artist.studioId !== studioId) {
      throw new NotFoundException('Artista não pertence a este estúdio.');
    }

    return this.prisma.artist.update({
      where: { id: artistId },
      data: {
        displayName: dto.displayName ?? artist.displayName,
        bio: dto.bio ?? artist.bio,
        instagram: dto.instagram ?? artist.instagram,
      },
    });
  }

  async adminFindAll() {
    return this.prisma.studio.findMany({
      include: {
        owner: true,
        artists: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adminUpdate(id: string, dto: UpdateStudioDto) {
    return this.prisma.studio.update({
      where: { id },
      data: dto,
    });
  }

  async adminRemove(id: string) {
    return this.prisma.studio.delete({
      where: { id },
    });
  }
}
