import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  EVENT_SERVICE,
  Patterns,
  RpcBadRequestException,
  TicketTierType,
} from '@app/shared';

@Injectable()
export class TicketTierService {
  constructor(@Inject(EVENT_SERVICE) private eventService: ClientProxy) {}

  async _process(id: string, event: string): Promise<TicketTierType> {
    const ticketTier: TicketTierType = await this.findOne(id, event);
    this.hasAvailableSeats(ticketTier);
    this.updateBookedSeats(ticketTier.id, 1);
    return ticketTier;
  }

  findOne(id: string, event: string): Promise<TicketTierType> {
    return firstValueFrom(
      this.eventService.send(Patterns.TICKET_TIERS.FIND_ONE, { id, event }),
    );
  }

  private hasAvailableSeats(ticketTier: TicketTierType): void {
    if (ticketTier.capacity <= ticketTier.bookedSeats) {
      throw new RpcBadRequestException(
        'No available seats for this ticket tier',
      );
    }
  }

  updateBookedSeats(id: string, increment: number): void {
    this.eventService.emit(Patterns.TICKET_TIERS.UPDATE_BOOKED_SEATS, {
      id,
      increment,
    });
  }
}
