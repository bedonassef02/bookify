import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern } from '@nestjs/microservices';
import { Patterns } from '@app/shared';

@Controller()
export class PaymentController {
  constructor(private readonly paymentServiceService: PaymentService) {}

  @MessagePattern(Patterns.PAYMENT.HELLO)
  getHello(): string {
    return this.paymentServiceService.getHello();
  }
}
