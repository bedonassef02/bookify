import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BOOKING_SERVICE, ClientModule, BOOKING_QUEUE } from '@app/shared';

@Module({
  imports: [
    ClientModule.register({ name: BOOKING_SERVICE, queue: BOOKING_QUEUE }),
  ],
  controllers: [BookingController],
})
export class BookingModule {}
