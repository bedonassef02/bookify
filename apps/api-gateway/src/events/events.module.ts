import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { ClientModule } from '@app/shared';
import { BookingController } from './booking.controller';

@Module({
  imports: [
    ClientModule.register({ name: 'EVENT_SERVICE', queue: 'events_queue' }),
  ],
  controllers: [EventsController, BookingController],
})
export class EventsModule {}
