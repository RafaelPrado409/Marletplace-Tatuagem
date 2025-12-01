import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { StudiosModule } from './studios/studios.module.js';
import { ArtistsModule } from './artists/artists.module.js';
import { StylesModule } from './styles/styles.module.js';
import { PortfolioModule } from './portfolio/portfolio.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MeModule } from './me/me.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    StudiosModule,
    ArtistsModule,
    StylesModule,
    PortfolioModule,
    AppointmentsModule,
    UsersModule,
    MeModule,
  ],
})
export class AppModule {}
