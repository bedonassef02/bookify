import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketTierService } from './ticket-tier.service';
import { TicketTierController } from './ticket-tier.controller';
import { TicketTier, TicketTierSchema } from '../entities/ticket-tier.entity';
import { TicketTierRepository } from '../repositories/ticket-tier.repository';
import { EventRepository } from '../repositories/event.repository';
import { Event, EventSchema } from '../entities/event.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TicketTier.name, schema: TicketTierSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  providers: [TicketTierService, TicketTierRepository, EventRepository],
  controllers: [TicketTierController],
  exports: [TicketTierService],
})
export class TicketTierModule {}
