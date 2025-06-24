import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { ClientModule } from '../common/modules/client.module';

@Module({
  imports: [
    ClientModule.register({ name: 'EVENT_SERVICE', queue: 'events_queue' }),
  ],
  controllers: [EventsController],
})
export class EventsModule {}
