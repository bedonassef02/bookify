import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
