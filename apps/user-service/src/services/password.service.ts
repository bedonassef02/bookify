import { Injectable } from '@nestjs/common';
import {
  RpcBadRequestException,
  RpcUnauthorizedException,
  ChangePasswordDto,
} from '@app/shared';
import { HashingService } from '../hashing/hashing.service';

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
}
