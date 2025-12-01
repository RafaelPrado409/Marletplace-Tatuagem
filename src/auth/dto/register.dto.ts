import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(2, 120)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 100)
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
