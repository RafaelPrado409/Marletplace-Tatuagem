/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('me')
export class MeController {
  constructor(private prisma: PrismaService) {}

  @Get('appointments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  async myAppointments(@Req() req) {
    const userId = req.user.userId;

    return this.prisma.appointment.findMany({
      where: { clientId: userId },
      orderBy: { startsAt: 'desc' },
      include: {
        artist: {
          include: {
            studio: true,
            styles: { include: { style: true } },
          },
        },
      },
    });
  }

  @Get('artist/appointments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ARTIST', 'ADMIN')
  async myArtistAppointments(@Req() req) {
    const userId = req.user.userId;

    const artist = await this.prisma.artist.findFirst({
      where: { userId },
    });

    if (!artist) {
      throw new NotFoundException('Artist profile not found for this user');
    }

    return this.prisma.appointment.findMany({
      where: { artistId: artist.id },
      orderBy: { startsAt: 'desc' },
      include: {
        client: true,
        artist: {
          include: {
            studio: true,
          },
        },
      },
    });
  }
}
