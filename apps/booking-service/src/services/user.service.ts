import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Patterns, USER_SERVICE } from '@app/shared';
import { BookingDocument } from '../entities/booking.entity';

@Injectable()
export class UserService {
  constructor(@Inject(USER_SERVICE) private userService: ClientProxy) {}

  async _process(bookings: BookingDocument[]): Promise<string[]> {
    const userIds = bookings.map((booking) => booking.user);
    return this.findEmails(userIds);
  }

  private findEmails(ids: string[]): Promise<string[]> {
    return firstValueFrom(
      this.userService.send(Patterns.USERS.FIND_EMAILS_BY_IDS, { ids }),
    );
  }
}
