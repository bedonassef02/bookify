import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { ClientModule, EVENT_SERVICE } from '@app/shared';
import { CloudinaryModule } from '@app/file-storage';
import { ImagesController } from './images/images.controller';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    CloudinaryModule,
    CategoriesModule,
    ClientModule.register({ name: EVENT_SERVICE, queue: 'events_queue' }),
  ],
  controllers: [EventsController, ImagesController],
})
export class EventsModule {}
