import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import {
  BOOKING_QUEUE,
  BOOKING_SERVICE,
  ClientModule,
  CoreModule,
  DatabaseModule,
} from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { PaymentRepository } from './repositories/payment.repository';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    CoreModule.forRoot({ validationSchema }),
    DatabaseModule.register({ dbName: 'paymentdb' }),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    ClientModule.register({ name: BOOKING_SERVICE, queue: BOOKING_QUEUE }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
})
export class AppModule {}
