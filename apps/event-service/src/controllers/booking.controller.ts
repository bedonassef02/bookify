import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookDto, Patterns } from '@app/shared';
import { BookingService } from '../services/booking.service';
import { BookingDocument } from '../entities/booking.entity';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @MessagePattern(Patterns.EVENTS.BOOK_SEATS)
  async bookSeats(
    @Payload() bookDto: BookDto,
  ): Promise<BookingDocument | null> {
    return this.bookingService.bookSeats(bookDto);
  }

  @MessagePattern(Patterns.EVENTS.CANCEL_BOOKING)
  async cancelBooking(
    @Payload() bookDto: BookDto,
  ): Promise<BookingDocument | null> {
    return this.bookingService.cancelBooking(bookDto);
  }

  @MessagePattern(Patterns.EVENTS.FIND_ALL_BY_USER)
  findAllByUser(@Payload('user') user: string): Promise<BookingDocument[]> {
    return this.bookingService.findAllByUser(user);
  }
}
