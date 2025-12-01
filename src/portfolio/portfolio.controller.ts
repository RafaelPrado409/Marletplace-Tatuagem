import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service.js';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ARTIST', 'ADMIN')
  create(@Req() req, @Body() dto: CreatePortfolioItemDto) {
    return this.service.create(dto);
  }

  @Get()
  listByArtist(@Query('artistId') artistId: string) {
    return this.service.listByArtist(artistId);
  }
}
