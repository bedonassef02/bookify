import { Injectable } from '@nestjs/common';
import { ICredentials } from '../interfaces/credentials.interface';
import * as dayjs from 'dayjs';
import { User } from '../entities/user.entity';

@Injectable()
export class CredentialsService {
  updatePassword(user: User): ICredentials {
    const now = dayjs().unix();
    return {
      version: (user.credentials?.version || 0) + 1,
      lastPassword: user.password,
      passwordUpdatedAt: now,
      updatedAt: now,
    };
  }
}
