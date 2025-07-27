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
  USERS_QUEUE,
  NOTIFICATION_QUEUE,
  EVENTS_QUEUE,
  PAYMENT_QUEUE,
} from '@app/shared';
import { BookingRepository } from './repositories/booking.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './entities/booking.entity';
import { NotificationService } from './mailer/notification.service';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { TicketTierService } from './services/ticket-tier.service';
import { PaymentService } from './services/payment.service';
import { CouponService } from './services/coupon.service';

@Module({
  imports: [
    CoreModule.forRoot(),
    DatabaseModule.register({ dbName: 'bookingdb' }),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    ClientModule.register([
      { name: USER_SERVICE, queue: USERS_QUEUE },
      { name: NOTIFICATION_SERVICE, queue: NOTIFICATION_QUEUE },
      { name: EVENT_SERVICE, queue: EVENTS_QUEUE },
      { name: PAYMENT_SERVICE, queue: PAYMENT_QUEUE },
    ]),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    BookingRepository,
    NotificationService,
    EventService,
    UserService,
    TicketTierService,
    PaymentService,
    CouponService,
  ],
})
export class AppModule {}
