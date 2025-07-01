import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ClientModule, DatabaseModule } from '@app/shared';
import { BookingRepository } from './repositories/booking.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './entities/booking.entity';

@Module({
  imports: [
    DatabaseModule.register({ dbName: 'bookingdb' }),
    ClientModule.register({ name: 'EVENT_SERVICE', queue: 'events_queue' }),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
})
export class AppModule {}
