import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BOOKING_SERVICE, Patterns } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BookingService {
  constructor(
    @Inject(BOOKING_SERVICE) private readonly bookingClient: ClientProxy,
  ) {}

  async hasUserBookedEvent(userId: string, eventId: string): Promise<boolean> {
    return firstValueFrom(
      this.bookingClient.send(Patterns.BOOKING.HAS_USER_BOOKED_EVENT, {
        userId,
        eventId,
      }),
    );
  }
}
