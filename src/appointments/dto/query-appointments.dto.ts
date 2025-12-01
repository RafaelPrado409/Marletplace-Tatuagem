import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryAppointmentsDto {
  @IsOptional()
  @IsString()
  artistId?: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED'])
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';

  @IsOptional()
  @IsDateString()
  date?: string; // YYYY-MM-DD

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
