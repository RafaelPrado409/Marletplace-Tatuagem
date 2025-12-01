import { IsOptional, IsString } from 'class-validator';

export class AddArtistByUserIdDto {
  @IsString()
  userId: string;

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
