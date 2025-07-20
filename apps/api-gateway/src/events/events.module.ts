import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { ClientModule, EVENT_SERVICE } from '@app/shared';
import { CloudinaryModule } from '../common/file-storage/services/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    ClientModule.register({ name: EVENT_SERVICE, queue: 'events_queue' }),
  ],
  controllers: [EventsController],
})
export class EventsModule {}
