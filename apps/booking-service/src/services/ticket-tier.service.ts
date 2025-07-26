import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  EVENT_SERVICE,
  Patterns,
  RpcBadRequestException,
  RpcNotFoundException,
  TicketTierType,
} from '@app/shared';

@Injectable()
export class TicketTierService {
  constructor(@Inject(EVENT_SERVICE) private eventService: ClientProxy) {}

  async findOne(id: string, event: string): Promise<TicketTierType> {
    const ticketTier: TicketTierType | null = await firstValueFrom(
      this.eventService.send(Patterns.TICKET_TIERS.FIND_ONE, { id, event }),
    );
    if (!ticketTier) {
      throw new RpcNotFoundException('Ticket tier not found');
    }

    return ticketTier;
  }

  hasAvailableSeats(ticketTier: TicketTierType): void {
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
