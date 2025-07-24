import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { ClientModule, PAYMENT_SERVICE } from '@app/shared';

@Module({
  imports: [
    ClientModule.register({ name: PAYMENT_SERVICE, queue: 'payment_queue' }),
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
