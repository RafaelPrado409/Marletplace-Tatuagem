/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { StudiosService } from './studios.service.js';
import { CreateStudioDto } from './dto/create-studio.dto.js';
import { UpdateStudioDto } from './dto/update-studio.dto.js';
import { AddArtistToStudioDto } from './dto/add-artists.dto.js';
import { AddArtistByUserIdDto } from './dto/add-artist-by-user-id.dto.js';
import { UpdateArtistInStudioDto } from './dto/update-artist-in-studio.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { GetUser } from '../auth/get-user-decorator.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('studios')
export class StudiosController {
  constructor(private readonly service: StudiosService) {}

  @Get()
  findAll(
    @Query('q') q?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
  ) {
    return this.service.findAll({ q, city, state });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyStudios(@Req() req: Request) {
    const user: any = (req as any).user;

    const userId = user?.userId;

    return this.service.findMyStudios(String(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateStudioDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudioDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my')
  async createMyStudio(@Req() req: Request, @Body() dto: CreateStudioDto) {
    const user: any = (req as any).user;

    const userId = user?.id ?? user?.sub ?? user?.userId;

    if (!userId) {
      throw new UnauthorizedException('Usuário sem id no token.');
    }

    return this.service.createForOwner(String(userId), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('studios/:id/artists')
  async addArtist(
    @GetUser('id') ownerId: string,
    @Param('id', ParseIntPipe) studioId: string,
    @Body() dto: AddArtistToStudioDto,
  ) {
    return this.service.addArtistToStudio(studioId, ownerId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('studios/:id/artists/:artistId')
  async removeArtist(
    @GetUser('id') ownerId: string,
    @Param('id', ParseIntPipe) studioId: string,
    @Param('artistId', ParseIntPipe) artistId: string,
  ) {
    return this.service.removeArtistFromStudio(studioId, ownerId, artistId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/available-artists')
  async getAvailableArtists(@Req() req: Request) {
    const user: any = (req as any).user;
    const ownerId = user?.userId;

    return this.service.findAvailableArtistsForOwner(String(ownerId));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':studioId/artists')
  async addArtistToStudio(
    @Param('studioId') studioId: string,
    @Req() req: Request,
    @Body() dto: AddArtistByUserIdDto,
  ) {
    const user: any = (req as any).user;
    const ownerId = user?.userId;

    return this.service.addArtistToStudioByUserId(
      String(studioId),
      String(ownerId),
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':studioId/artists/:artistId')
  async updateArtistInStudio(
    @Param('studioId') studioId: string,
    @Param('artistId') artistId: string,
    @Req() req: Request,
    @Body() dto: UpdateArtistInStudioDto,
  ) {
    const user: any = (req as any).user;
    const ownerId = user?.userId;

    return this.service.updateArtistInStudio(
      String(studioId),
      String(ownerId),
      String(artistId),
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':studioId/artists/:artistId')
  async removeArtistFromStudioController(
    @Param('studioId') studioId: string,
    @Param('artistId') artistId: string,
    @Req() req: Request,
  ) {
    const user: any = (req as any).user;
    const ownerId = user?.userId;

    return this.service.removeArtistFromStudio(
      String(studioId),
      String(ownerId),
      String(artistId),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/all')
  async adminList() {
    return this.service.adminFindAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/:id')
  async adminUpdate(@Param('id') id: string, @Body() dto: UpdateStudioDto) {
    return this.service.adminUpdate(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/:id')
  async adminDelete(@Param('id') id: string) {
    return this.service.adminRemove(id);
  }
}
