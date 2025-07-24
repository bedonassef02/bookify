import { Module } from '@nestjs/common';
import { ClientModule, EVENTS_QUEUE } from '@app/shared';
import { EVENT_SERVICE } from '@app/shared';
import { TicketTiersController } from './ticket-tiers.controller';

@Module({
  imports: [
    ClientModule.register({ name: EVENT_SERVICE, queue: EVENTS_QUEUE }),
  ],
  controllers: [TicketTiersController],
})
export class TicketTiersModule {}
