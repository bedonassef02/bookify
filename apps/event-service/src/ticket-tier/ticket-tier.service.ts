import { Injectable } from '@nestjs/common';
import { TicketTierRepository } from '../repositories/ticket-tier.repository';
import {
  CreateTicketTierDto,
  UpdateTicketTierDto,
  RpcNotFoundException,
} from '@app/shared';
import { TicketTier } from '../entities/ticket-tier.entity';

@Injectable()
export class TicketTierService {
  constructor(private readonly ticketTierRepository: TicketTierRepository) {}

  create(ticketTierDto: CreateTicketTierDto): Promise<TicketTier> {
    return this.ticketTierRepository.create(ticketTierDto);
  }

  findAll(): Promise<TicketTier[]> {
    return this.ticketTierRepository.findAll();
  }

  async findOne(id: string): Promise<TicketTier> {
    const ticketTier = await this.ticketTierRepository.findById(id);
    if (!ticketTier) {
      throw new RpcNotFoundException('Ticket tier not found');
    }
    return ticketTier;
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
    const ticketTier = await this.ticketTierRepository.delete(id);
    if (!ticketTier) {
      throw new RpcNotFoundException('Ticket tier not found');
    }
    return ticketTier;
  }

  updateBookedSeats(id: string, increment: number): Promise<TicketTier | null> {
    return this.ticketTierRepository.updateBookedSeats(id, increment);
  }
}
