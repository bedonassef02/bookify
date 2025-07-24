import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { BOOKING_SERVICE, CreatePaymentIntentDto } from '@app/shared';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(BOOKING_SERVICE) private readonly bookingClient: ClientProxy,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') as string,
      {
        apiVersion: '2025-06-30.basil',
      },
    );
  }

  async createPaymentIntent(paymentIntentDto: CreatePaymentIntentDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: paymentIntentDto.amount,
      currency: paymentIntentDto.currency,
      metadata: { bookingId: paymentIntentDto.bookingId },
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  handleWebhook(event: any, signature: string) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    ) as string;

    try {
      const stripeEvent = this.stripe.webhooks.constructEvent(
        event,
        signature,
        webhookSecret,
      );

      if (stripeEvent.type === 'payment_intent.succeeded') {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;
        this.bookingClient.emit('payment.succeeded', { bookingId });
      }
    } catch (err) {
      console.error(err);
      return { received: false };
    }

    return { received: true };
  }
}
