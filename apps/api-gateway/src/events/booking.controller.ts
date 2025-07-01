import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Patterns } from '@app/shared';
import { CurrentUser } from '../users/auth/decorators/current-user.decorator';

@Controller('events/:event/booking')
export class BookingController {
  constructor(@Inject('EVENT_SERVICE') private client: ClientProxy) {}

  @Post()
  bookEvent(
    @CurrentUser('userId') user: string,
    @Param('event') event: string,
    @Body('seats', ParseIntPipe) seats: number,
  ) {
    return this.client.send(Patterns.EVENTS.BOOK_SEATS, { user, event, seats });
  }
}
