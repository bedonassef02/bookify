import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { ClientModule, EVENT_SERVICE, EVENTS_QUEUE } from '@app/shared';
import { CloudinaryModule } from '@app/file-storage';
import { ImagesController } from './images/images.controller';
import { CategoriesModule } from './categories/categories.module';
import { TicketTiersModule } from './ticket-tiers/ticket-tiers.module';

@Module({
  imports: [
    CloudinaryModule,
    CategoriesModule,
    TicketTiersModule,
    ClientModule.register({ name: EVENT_SERVICE, queue: EVENTS_QUEUE }),
  ],
  controllers: [EventsController, ImagesController],
})
export class EventsModule {}
