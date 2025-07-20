import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { ClientModule, EVENT_SERVICE } from '@app/shared';
import { CloudinaryModule } from '@app/file-storage';

@Module({
  imports: [
    CloudinaryModule,
    ClientModule.register({ name: EVENT_SERVICE, queue: 'events_queue' }),
  ],
  controllers: [EventsController],
})
export class EventsModule {}
