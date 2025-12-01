import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AddArtistToStudioDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  instagram?: string;
}
