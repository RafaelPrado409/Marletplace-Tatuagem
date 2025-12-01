import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryArtistsDto {
  @IsOptional()
  @IsString()
  city?: string; // filtra pela cidade do estúdio

  @IsOptional()
  @IsString()
  style?: string; // slug do estilo

  @IsOptional()
  @IsString()
  q?: string; // busca por displayName/bio

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  size?: number = 12;

  @IsOptional()
  @IsString()
  studioId?: string;
}
