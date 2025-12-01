import { Controller, Get, Query, Post, Body, Param } from '@nestjs/common';
import { ArtistsService } from './artists.service.js';
import { QueryArtistsDto } from './dto/query-artists.dto.js';
import { CreateArtistDto } from './dto/create-artist.dto.js';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly service: ArtistsService) {}

  @Get()
  findAll(@Query() query: QueryArtistsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateArtistDto) {
    return this.service.create(dto);
  }
}
