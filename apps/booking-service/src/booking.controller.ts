import { Controller } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookDto, Patterns } from '@app/shared';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Booking } from './entities/booking.entity';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern(Patterns.BOOKING.FIND_ONE)
  findOne(
    @Payload('id') id: string,
    @Payload('user') user: string,
  ): Promise<Booking> {
    return this.bookingService.findOne(id, user);
  }

  @MessagePattern(Patterns.BOOKING.FIND_ALL_BY_USER)
  findAllByUser(@Payload('user') user: string): Promise<Booking[]> {
    return this.bookingService.findAllByUser(user);
  }

  @MessagePattern(Patterns.BOOKING.BOOK_SEATS)
  bookSeats(@Payload() bookDto: BookDto): Promise<Booking> {
    return this.bookingService.bookSeats(bookDto);
  }

  @MessagePattern(Patterns.BOOKING.CANCEL_BOOKING)
  cancelBooking(
    @Payload('id') id: string,
    @Payload('user') user: string,
  ): Promise<void> {
    return this.bookingService.cancel(id, user);
  }

  @MessagePattern(Patterns.BOOKING.CANCEL_MANY)
  cancelMany(@Payload('event') event: string): Promise<void> {
    return this.bookingService.cancelMany(event);
  }

  @EventPattern(Patterns.PAYMENTS.SUCCEEDED)
  async handlePaymentSucceeded(
    @Payload('bookingId') bookingId: string,
    @Payload('paymentIntentId') paymentIntentId: string,
  ) {
    return this.bookingService.handlePaymentSucceeded(
      bookingId,
      paymentIntentId,
    );
  }
}
