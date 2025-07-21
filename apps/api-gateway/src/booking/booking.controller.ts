import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../users/auth/decorators/current-user.decorator';
import { BookDto, BOOKING_SERVICE, Patterns } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('booking')
export class BookingController {
  constructor(@Inject(BOOKING_SERVICE) private client: ClientProxy) {}

  @Get()
  findAll(@CurrentUser('userId') user: string) {
    return this.client.send(Patterns.BOOKING.FIND_ALL_BY_USER, { user });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.client.send(Patterns.BOOKING.FIND_ONE, { id, userId });
  }

  @Post()
  book(@CurrentUser('userId') user: string, @Body() bookDto: BookDto) {
    bookDto.user = user;
    return this.client.send(Patterns.BOOKING.BOOK_SEATS, bookDto);
  }
}
