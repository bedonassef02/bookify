import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketTierService } from './ticket-tier.service';
import { TicketTierController } from './ticket-tier.controller';
import { TicketTier, TicketTierSchema } from '../entities/ticket-tier.entity';
import { TicketTierRepository } from '../repositories/ticket-tier.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TicketTier.name, schema: TicketTierSchema },
    ]),
  ],
  providers: [TicketTierService, TicketTierRepository],
  controllers: [TicketTierController],
  exports: [TicketTierService],
})
export class TicketTierModule {}
