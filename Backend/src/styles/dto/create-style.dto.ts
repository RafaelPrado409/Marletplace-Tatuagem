import { IsString, Length, Matches } from 'class-validator';

export class CreateStyleDto {
  @IsString()
  @Length(2, 60)
  name!: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;
}
