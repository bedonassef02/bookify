import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { IsDifferentFrom, PASSWORD_REGEX } from '@app/shared';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsDifferentFrom('currentPassword')
  @Matches(PASSWORD_REGEX)
  newPassword: string;
}
