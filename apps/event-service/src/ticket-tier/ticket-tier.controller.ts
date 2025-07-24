import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  Patterns,
  CreateTicketTierDto,
  UpdateTicketTierDto,
} from '@app/shared';
import { TicketTierService } from './ticket-tier.service';
import { TicketTier } from '../entities/ticket-tier.entity';

@Controller()
export class TicketTierController {
  constructor(private readonly ticketTierService: TicketTierService) {}

  @MessagePattern(Patterns.TICKET_TIERS.CREATE)
  create(@Payload() ticketTierDto: CreateTicketTierDto): Promise<TicketTier> {
    return this.ticketTierService.create(ticketTierDto);
  }

  @MessagePattern(Patterns.TICKET_TIERS.FIND_ALL)
  findAll(@Payload('event') event: string): Promise<TicketTier[]> {
    return this.ticketTierService.findAll(event);
  }

  @MessagePattern(Patterns.TICKET_TIERS.FIND_ONE)
  findOne(
    @Payload('id') id: string,
    @Payload('event') event: string,
  ): Promise<TicketTier> {
    return this.ticketTierService.findOne(id, event);
  }

  @MessagePattern(Patterns.TICKET_TIERS.UPDATE)
  update(
    @Payload('id') id: string,
    @Payload('ticketTierDto') ticketTierDto: UpdateTicketTierDto,
  ): Promise<TicketTier> {
    return this.ticketTierService.update(id, ticketTierDto);
  }

  @MessagePattern(Patterns.TICKET_TIERS.REMOVE)
  remove(@Payload('id') id: string): Promise<TicketTier> {
    return this.ticketTierService.remove(id);
  }

  @MessagePattern(Patterns.TICKET_TIERS.UPDATE_BOOKED_SEATS)
  updateBookedSeats(
    @Payload('id') id: string,
    @Payload('increment') increment: number,
  ): Promise<TicketTier | null> {
    return this.ticketTierService.updateBookedSeats(id, increment);
  }
}
