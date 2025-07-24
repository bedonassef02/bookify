import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { Patterns, CreatePaymentIntentDto } from '@app/shared';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(Patterns.PAYMENTS.CREATE_INTENT)
  createPaymentIntent(@Payload() paymentIntentDto: CreatePaymentIntentDto) {
    return this.paymentService.createPaymentIntent(paymentIntentDto);
  }

  @MessagePattern(Patterns.PAYMENTS.WEBHOOK)
  handleStripeWebhook(@Payload() payload: { event: any; signature: string }) {
    return this.paymentService.handleWebhook(payload.event, payload.signature);
  }
}
