import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { BOOKING_SERVICE, ClientModule, CoreModule } from '@app/shared';

@Module({
  imports: [
    CoreModule.forRoot(),
    ClientModule.register({ name: BOOKING_SERVICE, queue: 'booking_queue' }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class AppModule {}
