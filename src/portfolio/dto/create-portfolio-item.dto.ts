import { IsString, IsOptional, Length } from 'class-validator';

export class CreatePortfolioItemDto {
  @IsString() artistId!: string;
  @IsString() @Length(1, 140) title!: string;
  @IsString() imageUrl!: string; // por ora URL simples
  @IsOptional() @IsString() @Length(0, 500) description?: string;
}
