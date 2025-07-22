import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule, CoreModule } from '@app/shared';
import { Event, EventSchema } from '../entities/event.entity';
import { Category, CategorySchema } from '../entities/category.entity';
import { TicketTier, TicketTierSchema } from '../entities/ticket-tier.entity';
import { EventSeeder } from './event.seeder';
import { CategorySeeder } from './category.seeder';
import { TicketTierSeeder } from './ticket-tier.seeder';

@Module({
  imports: [
    CoreModule.forRoot(),
    DatabaseModule.register({ dbName: 'eventdb' }),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Category.name, schema: CategorySchema },
      { name: TicketTier.name, schema: TicketTierSchema },
    ]),
  ],
  providers: [EventSeeder, CategorySeeder, TicketTierSeeder],
})
export class SeederModule {}
