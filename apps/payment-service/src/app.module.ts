import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { BOOKING_SERVICE, ClientModule, CoreModule, DatabaseModule } from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  imports: [
    CoreModule.forRoot(),
    ClientModule.register({ name: BOOKING_SERVICE, queue: 'booking_queue' }),
    DatabaseModule.register({ dbName: 'paymentdb' }),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
})
export class AppModule {}
