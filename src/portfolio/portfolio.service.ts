/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto.js';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePortfolioItemDto) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: dto.artistId },
    });
    if (!artist) throw new NotFoundException('Artist not found');
    return this.prisma.portfolioItem.create({ data: dto });
  }

  listByArtist(artistId: string) {
    return this.prisma.portfolioItem.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
