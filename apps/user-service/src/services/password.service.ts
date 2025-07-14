import { Injectable } from '@nestjs/common';
import {
  RpcBadRequestException,
  RpcUnauthorizedException,
  ChangePasswordDto,
} from '@app/shared';
import { HashingService } from '../hashing/hashing.service';
import { User } from '../entities/user.entity';
import * as dayjs from 'dayjs';
import { QUnitType } from 'dayjs';

@Injectable()
export class PasswordService {
  constructor(private readonly hashing: HashingService) {}

  async compare(plain: string, hashed: string): Promise<boolean> {
    return this.hashing.compare(plain, hashed);
  }

  async hash(plain: string): Promise<string> {
    return this.hashing.hash(plain);
  }

  async verify(current: string, existing: string): Promise<void> {
    const isValid = await this.compare(current, existing);
    if (!isValid) {
      throw new RpcUnauthorizedException('Invalid credentials');
    }
  }

  ensureDifferent(passwordDto: ChangePasswordDto): void {
    if (passwordDto.newPassword === passwordDto.currentPassword) {
      throw new RpcBadRequestException('New password must be different');
    }
  }

  async isLast(user: User, password: string): Promise<void> {
    if (!user.credentials) return;
    const { lastPassword, passwordUpdatedAt } = user.credentials;

    if (!lastPassword || !(await this.compare(password, lastPassword))) {
      return;
    }

    const timeUnits = [
      { unit: 'month', threshold: 1, name: 'month' },
      { unit: 'day', threshold: 1, name: 'day' },
      { unit: 'hour', threshold: 0, name: 'hour' },
    ];

    const now = dayjs();
    const lastChanged = dayjs.unix(passwordUpdatedAt);
    const baseMessage = 'You changed your password ';

    for (const { unit, threshold, name } of timeUnits) {
      const diff = now.diff(lastChanged, unit as QUnitType);
      if (diff > threshold) {
        throw new RpcUnauthorizedException(
          `${baseMessage}${diff} ${name}${diff > 1 ? 's' : ''} ago`,
        );
      }
    }

    throw new RpcUnauthorizedException(baseMessage + 'recently');
  }
}
