import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@app/shared/dto/user/create-user.dto';
import { ICredentials } from '../../../../../apps/user-service/src/interfaces/credentials.interface';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  credentials?: ICredentials;
  verified?: boolean;
  confirmationToken?: string | undefined;
  confirmationTokenExpiry?: Date | undefined;
  resetPasswordToken?: string | undefined;
  resetPasswordTokenExpiry?: Date | undefined;
}
