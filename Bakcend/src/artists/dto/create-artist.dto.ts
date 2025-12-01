import {
  IsOptional,
  IsString,
  Length,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @Length(2, 120)
  displayName!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  bio?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  instagram?: string;

  @IsString() // ID do estúdio ao qual o artista pertence
  studioId!: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  styles?: string[]; // slugs de estilos, ex.: ["realista","old-school"]
}
