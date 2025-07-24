import { Controller, Post, Body, Headers } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { Patterns, CreatePaymentIntentDto } from '@app/shared';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(Patterns.PAYMENTS.CREATE_INTENT)
  createPaymentIntent(@Payload() paymentIntentDto: CreatePaymentIntentDto) {
    return this.paymentService.createPaymentIntent(paymentIntentDto);
  }

  @Post('webhook')
  handleStripeWebhook(
    @Body() event: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentService.handleWebhook(event, signature);
  }
}
