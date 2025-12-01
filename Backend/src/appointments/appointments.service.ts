/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { QueryAppointmentsDto } from './dto/query-appointments.dto.js';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto, clientId: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: dto.artistId },
    });
    if (!artist) throw new NotFoundException('Artist not found');

    const client = await this.prisma.user.findUnique({
      where: { id: clientId },
    });
    if (!client) throw new NotFoundException('Client not found');

    const overlap = await this.prisma.appointment.findFirst({
      where: {
        artistId: dto.artistId,
        OR: [
          {
            startsAt: { lt: new Date(dto.endsAt) },
            endsAt: { gt: new Date(dto.startsAt) },
          },
        ],
      },
    });
    if (overlap)
      throw new BadRequestException('Artist already booked for this time');

    return this.prisma.appointment.create({
      data: {
        artistId: dto.artistId,
        clientId,
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        status: 'PENDING',
        notes: dto.notes,
      },
    });
  }

  async findAll(query: QueryAppointmentsDto) {
    const { artistId, clientId, status, date, from, to } = query;

    const where: any = {};

    if (artistId) where.artistId = artistId;
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    // Filtrar por UMA data específica (ignora horário)
    if (date) {
      const start = new Date(date + 'T00:00:00.000Z');
      const end = new Date(date + 'T23:59:59.999Z');
      where.startsAt = { gte: start, lte: end };
    }

    // Intervalo livre (from / to)
    if (from || to) {
      where.startsAt = {};
      if (from) where.startsAt.gte = new Date(from);
      if (to) where.startsAt.lte = new Date(to);
    }

    return this.prisma.appointment.findMany({
      where,
      orderBy: { startsAt: 'asc' },
      include: {
        artist: true,
        client: true,
      },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        artist: true,
        client: true,
      },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    return appointment;
  }
}
