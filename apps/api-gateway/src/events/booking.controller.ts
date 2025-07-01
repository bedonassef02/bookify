import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Patterns } from '@app/shared';
import { CurrentUser } from '../users/auth/decorators/current-user.decorator';

@Controller('events')
export class BookingController {
  constructor(@Inject('EVENT_SERVICE') private client: ClientProxy) {}

  @Get('booking/all')
  findAll(@CurrentUser('userId') user: string) {
    return this.client.send(Patterns.EVENTS.FIND_ALL_BY_USER, { user });
  }

  @Post(':event/booking')
  bookEvent(
    @CurrentUser('userId') user: string,
    @Param('event') event: string,
    @Body('seats', ParseIntPipe) seats: number,
  ) {
    return this.client.send(Patterns.EVENTS.BOOK_SEATS, { user, event, seats });
  }

  @Post(':event/booking/cancel')
  cancelEvent(
    @CurrentUser('userId') user: string,
    @Param('event') event: string,
    @Body('seats', ParseIntPipe) seats: number,
  ) {
    return this.client.send(Patterns.EVENTS.CANCEL_BOOKING, {
      user,
      event,
      seats,
    });
  }
}
