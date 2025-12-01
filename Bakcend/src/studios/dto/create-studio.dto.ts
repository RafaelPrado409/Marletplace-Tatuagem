/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateStudioDto {
  @IsString()
  @Length(2, 120)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsString()
  @Length(2, 100)
  address!: string;

  @IsString()
  @Length(2, 60)
  city!: string;

  @IsString()
  @Length(2, 2)
  state!: string; // UF

  @IsOptional()
  @IsString()
  @Matches(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, { message: 'phone inválido' })
  phone?: string;
}
