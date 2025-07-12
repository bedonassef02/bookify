import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { NAME_REGEX, PASSWORD_REGEX } from '@app/shared';

export class SignUpDto {
  @IsString()
  @Matches(NAME_REGEX)
  firstName: string;

  @IsString()
  @Matches(NAME_REGEX)
  lastName: string;

  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @IsString()
  @Length(8, 20)
  @Matches(PASSWORD_REGEX)
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
