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
  findAll(): Promise<TicketTier[]> {
    return this.ticketTierService.findAll();
  }

  @MessagePattern(Patterns.TICKET_TIERS.FIND_ONE)
  findOne(@Payload('id') id: string): Promise<TicketTier> {
    return this.ticketTierService.findOne(id);
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
}
