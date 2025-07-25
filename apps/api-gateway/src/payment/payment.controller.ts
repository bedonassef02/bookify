import { Controller, Post, Body, Inject, Headers } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentIntentDto, Patterns, PAYMENT_SERVICE } from '@app/shared';
import { Public } from '../users/auth/decorators/public.decorator';

@Controller({ path: 'payment', version: '1' })
export class PaymentController {
  constructor(@Inject(PAYMENT_SERVICE) private readonly client: ClientProxy) {}

  @Post('create-intent')
  createPaymentIntent(@Body() paymentIntentDto: CreatePaymentIntentDto) {
    return this.client.send(Patterns.PAYMENTS.CREATE_INTENT, paymentIntentDto);
  }

  @Public()
  @Post('webhook')
  handleStripeWebhook(
    @Body() event: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.client.send(Patterns.PAYMENTS.WEBHOOK, { event, signature });
  }
}
