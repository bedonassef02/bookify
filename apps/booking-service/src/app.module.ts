import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import {
  ClientModule,
  DatabaseModule,
  CoreModule,
  USER_SERVICE,
  NOTIFICATION_SERVICE,
  EVENT_SERVICE,
  PAYMENT_SERVICE,
} from '@app/shared';
import { BookingRepository } from './repositories/booking.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './entities/booking.entity';
import { NotificationService } from './mailer/notification.service';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { TicketTierService } from './services/ticket-tier.service';

@Module({
  imports: [
    CoreModule.forRoot(),
    ClientModule.register([
      { name: USER_SERVICE, queue: 'users_queue' },
      { name: NOTIFICATION_SERVICE, queue: 'notification_queue' },
      { name: EVENT_SERVICE, queue: 'events_queue' },
      { name: PAYMENT_SERVICE, queue: 'payment_queue' },
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
    UserService,
    TicketTierService,
  ],
})
export class AppModule {}
