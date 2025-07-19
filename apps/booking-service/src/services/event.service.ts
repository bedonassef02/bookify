import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  EVENT_SERVICE,
  EventType,
  Patterns,
  RpcBadRequestException,
} from '@app/shared';

@Injectable()
export class EventService {
  constructor(@Inject(EVENT_SERVICE) private eventService: ClientProxy) {}

  findOne(id: string): Promise<EventType> {
    return firstValueFrom(
      this.eventService.send(Patterns.EVENTS.FIND_ONE, { id }),
    );
  }

  async getBookedSeats(id: string): Promise<number> {
    const event: EventType = await this.findOne(id);
    this.check(event);
    return event.bookedSeats;
  }

  updateBookedSeats(id: string, seats: number): void {
    this.eventService.emit(Patterns.EVENTS.UPDATE, {
      id,
      eventDto: { bookedSeats: seats + 1 },
    });
  }

  private check(event: EventType): void {
    if (event.date <= new Date()) {
      throw new RpcBadRequestException('Cannot book seats for past events');
    }

    if (!event.isActive) {
      throw new RpcBadRequestException('Event is not available for booking');
    }

    if (event.capacity <= event.bookedSeats) {
      throw new RpcBadRequestException('No available seats');
    }
  }
}
