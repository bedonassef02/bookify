import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ClientModule, DatabaseModule, CoreModule } from '@app/shared';
import { BookingRepository } from './repositories/booking.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './entities/booking.entity';
import { NotificationService } from './services/notification.service';
import { EventService } from './services/event.service';

@Module({
  imports: [
    CoreModule.forRoot(),
    ClientModule.register([
      { name: 'USER_SERVICE', queue: 'users_queue' },
      { name: 'NOTIFICATION_SERVICE', queue: 'notification_queue' },
      { name: 'EVENT_SERVICE', queue: 'events_queue' },
    ]),
    DatabaseModule.register({ dbName: 'bookingdb' }),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    BookingRepository,
    NotificationService,
    EventService,
  ],
})
export class AppModule {}
