import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  EVENT_SERVICE,
  EventType,
  Patterns,
  TicketTierType,
} from '@app/shared';

@Injectable()
export class EventService {
  constructor(@Inject(EVENT_SERVICE) private eventService: ClientProxy) {}

  findOne(id: string): Promise<EventType> {
    return firstValueFrom(
      this.eventService.send(Patterns.EVENTS.FIND_ONE, { id }),
    );
  }

  getTicketTier(id: string): Promise<TicketTierType> {
    return firstValueFrom(
      this.eventService.send(Patterns.TICKET_TIERS.FIND_ONE, { id }),
    );
  }

  updateTicketTierBookedSeats(id: string, seats: number): void {
    this.eventService.emit(Patterns.TICKET_TIERS.UPDATE, {
      id,
      updateTicketTierDto: { bookedSeats: seats + 1 },
    });
  }

  decrementTicketTierBookedSeats(id: string, seats: number): void {
    this.eventService.emit(Patterns.TICKET_TIERS.UPDATE, {
      id,
      updateTicketTierDto: { bookedSeats: seats - 1 },
    });
  }
}
