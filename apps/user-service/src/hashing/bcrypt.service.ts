import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { genSalt, compare, hash } from 'bcrypt';

@Injectable()
export class BcryptService extends HashingService {
  async hash(password: string): Promise<string> {
    const salt = await genSalt();
    return hash(password, salt);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
