import { Controller, Get, Inject } from '@nestjs/common';
import { CurrentUser } from '../users/auth/decorators/current-user.decorator';
import { Patterns } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';

@Controller('booking')
export class BookingController {
  constructor(@Inject('BOOKING_SERVICE') private client: ClientProxy) {}

  @Get()
  findAll(@CurrentUser('userId') user: string) {
    return this.client.send(Patterns.BOOKING.FIND_ALL_BY_USER, { user });
  }
}
