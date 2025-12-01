import { Module } from '@nestjs/common';
import { StudiosService } from './studios.service.js';
import { StudiosController } from './studios.controller.js';

@Module({ controllers: [StudiosController], providers: [StudiosService] })
export class StudiosModule {}
