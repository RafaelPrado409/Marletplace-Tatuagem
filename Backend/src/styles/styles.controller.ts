import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { StylesService } from './styles.service.js';
import { CreateStyleDto } from './dto/create-style.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Controller('styles')
export class StylesController {
  constructor(private readonly service: StylesService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateStyleDto) {
    return this.service.create(dto);
  }
}
