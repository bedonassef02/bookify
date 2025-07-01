import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { ClientModule } from '@app/shared';

@Module({
  imports: [
    ClientModule.register({ name: 'BOOKING_SERVICE', queue: 'booking_queue' }),
  ],
  controllers: [BookingController],
})
export class BookingModule {}
