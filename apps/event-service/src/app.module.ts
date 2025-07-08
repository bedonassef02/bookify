import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClientModule,
  DatabaseModule,
  CoreModule,
  BOOKING_SERVICE,
} from '@app/shared';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './repositories/event.repository';
import { Event, EventSchema } from './entities/event.entity';
import { BookingService } from './services/booking.service';

@Module({
  imports: [
    CoreModule.forRoot(),
    ClientModule.register({
      name: BOOKING_SERVICE,
      queue: 'booking_queue',
    }),
    DatabaseModule.register({ dbName: 'eventdb' }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository, BookingService],
})
export class AppModule {}
