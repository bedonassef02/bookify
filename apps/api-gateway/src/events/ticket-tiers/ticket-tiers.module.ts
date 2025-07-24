import { Module } from '@nestjs/common';
import { ClientModule } from '@app/shared';
import { EVENT_SERVICE } from '@app/shared';
import { TicketTiersController } from './ticket-tiers.controller';

@Module({
  imports: [
    ClientModule.register({
      name: EVENT_SERVICE,
      queue: 'events_queue',
    }),
  ],
  controllers: [TicketTiersController],
})
export class TicketTiersModule {}
