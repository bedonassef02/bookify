import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  EVENT_SERVICE,
  Patterns,
  RpcNotFoundException,
  TicketTierType,
} from '@app/shared';

@Injectable()
export class TicketTierService {
  constructor(@Inject(EVENT_SERVICE) private eventService: ClientProxy) {}

  async findOne(id: string): Promise<TicketTierType> {
    const ticketTier: TicketTierType | null = await firstValueFrom(
      this.eventService.send(Patterns.TICKET_TIERS.FIND_ONE, { id }),
    );
    if (!ticketTier) {
      throw new RpcNotFoundException('Ticket tier not found');
    }

    return ticketTier;
  }

  updateBookedSeats(id: string, increment: number): void {
    this.eventService.emit(Patterns.TICKET_TIERS.UPDATE_BOOKED_SEATS, {
      id,
      increment,
    });
  }
}
