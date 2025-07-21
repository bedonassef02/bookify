import { Controller } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookDto, Patterns } from '@app/shared';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingDocument } from './entities/booking.entity';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern(Patterns.BOOKING.FIND_ONE)
  findOne(
    @Payload('id') id: string,
    @Payload('userId') userId: string,
  ): Promise<BookingDocument> {
    return this.bookingService.findOne(id, userId);
  }

  @MessagePattern(Patterns.BOOKING.FIND_ALL_BY_USER)
  findAllByUser(@Payload('user') user: string): Promise<BookingDocument[]> {
    return this.bookingService.findAllByUser(user);
  }

  @MessagePattern(Patterns.BOOKING.FIND_ALL_BY_EVENT)
  findAllByEvent(@Payload('event') event: string): Promise<BookingDocument[]> {
    return this.bookingService.findAllByEvent(event);
  }

  @MessagePattern(Patterns.BOOKING.BOOK_SEATS)
  bookSeats(@Payload() bookDto: BookDto): Promise<BookingDocument> {
    return this.bookingService.bookSeats(bookDto);
  }

  @MessagePattern(Patterns.BOOKING.CANCEL_MANY_BY_EVENT)
  cancelManyByEvent(@Payload('event') event: string): Promise<void> {
    return this.bookingService.cancelManyByEvent(event);
  }
}
