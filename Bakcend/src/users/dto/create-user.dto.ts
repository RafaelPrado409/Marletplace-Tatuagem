import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 120)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  password!: string;
}
