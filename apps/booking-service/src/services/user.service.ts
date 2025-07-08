import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Patterns, USER_SERVICE } from '@app/shared';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@Inject(USER_SERVICE) private userService: ClientProxy) {}

  findEmails(ids: Types.ObjectId[]): Promise<string[]> {
    return firstValueFrom(
      this.userService.send(Patterns.USERS.FIND_EMAILS_BY_IDS, { ids }),
    );
  }
}
