import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClientModule,
  DatabaseModule,
  CoreModule,
  BOOKING_SERVICE,
  BOOKING_QUEUE,
} from '@app/shared';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './repositories/event.repository';
import { Event, EventSchema } from './entities/event.entity';
import { BookingService } from './booking/booking.service';
import { CategoryModule } from './category/category.module';
import { TicketTierModule } from './ticket-tier/ticket-tier.module';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    CoreModule.forRoot({ validationSchema }),
    DatabaseModule.register({ dbName: 'eventdb' }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    ClientModule.register({ name: BOOKING_SERVICE, queue: BOOKING_QUEUE }),
    CategoryModule,
    TicketTierModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository, BookingService],
})
export class AppModule {}
