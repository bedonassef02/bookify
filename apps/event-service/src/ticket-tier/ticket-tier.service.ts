import { Injectable } from '@nestjs/common';
import { TicketTierRepository } from '../repositories/ticket-tier.repository';
import {
  CreateTicketTierDto,
  UpdateTicketTierDto,
  RpcNotFoundException,
} from '@app/shared';
import { TicketTier } from '../entities/ticket-tier.entity';
import { EventRepository } from '../repositories/event.repository';

@Injectable()
export class TicketTierService {
  constructor(
    private readonly ticketTierRepository: TicketTierRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async create(ticketTierDto: CreateTicketTierDto): Promise<TicketTier> {
    await this.eventRepository.findByIdOrFail(ticketTierDto.event);
    return this.ticketTierRepository.create(ticketTierDto);
  }

  findAll(event: string): Promise<TicketTier[]> {
    return this.ticketTierRepository.findAll({ event });
  }

  findOne(id: string, event: string): Promise<TicketTier> {
    return this.ticketTierRepository.findOneOrFail({
      _id: id,
      event,
    });
  }

  async update(
    id: string,
    ticketTierDto: UpdateTicketTierDto,
  ): Promise<TicketTier> {
    const ticketTier = await this.ticketTierRepository.update(
      id,
      ticketTierDto,
    );
    if (!ticketTier) {
      throw new RpcNotFoundException('Ticket tier not found');
    }
    return ticketTier;
  }

  async remove(id: string): Promise<TicketTier> {
    return this.ticketTierRepository.deleteOrFail(id);
  }

  updateBookedSeats(id: string, increment: number): Promise<TicketTier | null> {
    return this.ticketTierRepository.updateBookedSeats(id, increment);
  }
}
