import { Inject, Injectable } from '@nestjs/common';
import { Patterns, RpcNotFoundException } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import { BookingRepository } from './repositories/booking.repository';
import { BookingDocument } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    @Inject('EVENT_SERVICE') private client: ClientProxy,
  ) {}

  findAllByUser(user: string): Promise<BookingDocument[]> {
    return this.bookingRepository.findAllByUser(user);
  }

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
