import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { ClientModule, PAYMENT_SERVICE, PAYMENT_QUEUE } from '@app/shared';

@Module({
  imports: [
    ClientModule.register({ name: PAYMENT_SERVICE, queue: PAYMENT_QUEUE }),
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
