import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsDifferentFrom } from '@app/shared';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsDifferentFrom('currentPassword')
  newPassword: string;
}
