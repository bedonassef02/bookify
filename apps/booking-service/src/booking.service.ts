import { Inject, Injectable } from '@nestjs/common';
import { Patterns, RpcNotFoundException } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import { BookingRepository } from './repositories/booking.repository';

@Injectable()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    @Inject('EVENT_SERVICE') private client: ClientProxy,
  ) {}

  private canBook(event: string, seats: number): Observable<boolean> {
    return this.client.send(Patterns.EVENTS.FIND_ONE, event).pipe(
      map((existingEvent) => {
        if (!existingEvent) {
          throw new RpcNotFoundException(`Event with ID ${event} not found`);
        }

        return true;
      }),
    );
  }
}
