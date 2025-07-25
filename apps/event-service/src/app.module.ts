import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClientModule,
  DatabaseModule,
  CoreModule,
  BOOKING_SERVICE,
  BOOKING_QUEUE,
  LoggerModule,
  MetricsModule,
} from '@app/shared';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './repositories/event.repository';
import { Event, EventSchema } from './entities/event.entity';
import { BookingService } from './booking/booking.service';
import { CategoryModule } from './category/category.module';
import { TicketTierModule } from './ticket-tier/ticket-tier.module';

@Module({
  imports: [
    CoreModule.forRoot(),
    ClientModule.register({ name: BOOKING_SERVICE, queue: BOOKING_QUEUE }),
    DatabaseModule.register({ dbName: 'eventdb' }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    CategoryModule,
    TicketTierModule,
    LoggerModule,
    MetricsModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository, BookingService],
})
export class AppModule {}
