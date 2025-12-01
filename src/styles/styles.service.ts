/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateStyleDto } from './dto/create-style.dto.js';

@Injectable()
export class StylesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.style.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateStyleDto) {
    try {
      return await this.prisma.style.create({ data: dto });
    } catch (e: any) {
      if (e.code === 'P2002')
        throw new ConflictException('Style name/slug already exists');
      throw e;
    }
  }
}
