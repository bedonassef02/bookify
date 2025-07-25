import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { ClientModule, EVENT_SERVICE, EVENTS_QUEUE } from '@app/shared';

@Module({
  imports: [
    ClientModule.register({ name: EVENT_SERVICE, queue: EVENTS_QUEUE }),
  ],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
