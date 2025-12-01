import { Module } from '@nestjs/common';
import { StylesController } from './styles.controller.js';
import { StylesService } from './styles.service.js';

@Module({ controllers: [StylesController], providers: [StylesService] })
export class StylesModule {}
