import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Patterns } from '@app/shared';

@Injectable()
export class BookingService {
  constructor(@Inject('BOOKING_SERVICE') private bookingService: ClientProxy) {}

  cancelManyByEvent(event: string): void {
    this.bookingService.emit(Patterns.BOOKING.CANCEL_MANY_BY_EVENT, { event });
  }
}
