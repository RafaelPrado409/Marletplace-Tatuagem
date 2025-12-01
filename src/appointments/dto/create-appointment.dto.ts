import { IsString, IsDateString, IsOptional, Length } from 'class-validator';

export class CreateAppointmentDto {
  @IsString() artistId!: string;
  @IsDateString() startsAt!: string;
  @IsDateString() endsAt!: string;
  @IsOptional() @IsString() @Length(0, 500) notes?: string;
}
