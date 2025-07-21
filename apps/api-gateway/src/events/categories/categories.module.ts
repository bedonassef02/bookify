import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { ClientModule, EVENT_SERVICE } from '@app/shared';

@Module({
  imports: [
    ClientModule.register({ name: EVENT_SERVICE, queue: 'events_queue' }),
  ],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
