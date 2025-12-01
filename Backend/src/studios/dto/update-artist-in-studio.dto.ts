import { IsOptional, IsString } from 'class-validator';

export class UpdateArtistInStudioDto {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  instagram?: string;
}
