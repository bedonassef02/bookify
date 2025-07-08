import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { EVENT_SERVICE, Patterns, RpcBadRequestException } from '@app/shared';
import { Event } from '../interfaces/event.interface';

@Injectable()
export class EventService {
  constructor(@Inject(EVENT_SERVICE) private eventService: ClientProxy) {}

  findOne(id: string): Promise<Event> {
    return firstValueFrom(
      this.eventService.send(Patterns.EVENTS.FIND_ONE, { id }),
    );
  }

  async getBookedSeats(id: string): Promise<number> {
    const event: Event = await this.findOne(id);

    if (event.capacity <= event.bookedSeats) {
      throw new RpcBadRequestException(`Not enough available seats`);
    }

    return event.bookedSeats;
  }

  updateBookedSeats(id: string, seats: number): void {
    this.eventService.emit(Patterns.EVENTS.UPDATE, {
      id,
      eventDto: { bookedSeats: seats + 1 },
    });
  }
}
