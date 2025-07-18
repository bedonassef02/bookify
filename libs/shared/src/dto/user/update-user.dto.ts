import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@app/shared/dto/user/create-user.dto';
import { ICredentials } from '../../../../../apps/user-service/src/interfaces/credentials.interface';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  credentials?: ICredentials;
  verified?: boolean;
  confirmationToken?: string | null;
  confirmationTokenExpiry?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiry?: Date | null;
}
