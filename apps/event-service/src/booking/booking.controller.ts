import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { Patterns } from '@app/shared';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @MessagePattern(Patterns.BOOKING.FIND_ALL_BY_EVENT)
  findBookingsByEvent(@Payload('id') event: string) {
    return this.bookingService.findBookingsByEvent(event);
  }
}
