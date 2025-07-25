import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { BOOKING_SERVICE, CreatePaymentIntentDto } from '@app/shared';
import Stripe from 'stripe';
import { PaymentStatus } from './entities/payment.entity';
import { PaymentRepository } from './repositories/payment.repository';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(BOOKING_SERVICE) private readonly bookingClient: ClientProxy,
    private readonly paymentRepository: PaymentRepository,
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
      amount: paymentIntentDto.amount * 100,
      currency: paymentIntentDto.currency,
      metadata: { bookingId: paymentIntentDto.bookingId },
    });

    const payment = await this.paymentRepository.create({
      paymentIntentId: paymentIntent.id,
      amount: paymentIntentDto.amount,
      currency: paymentIntentDto.currency,
      bookingId: paymentIntentDto.bookingId,
      status: PaymentStatus.PENDING,
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(event: any, signature: string) {
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

        const payment = await this.paymentRepository.findOne({
          paymentIntentId: paymentIntent.id,
        });

        if (payment) {
          payment.status = PaymentStatus.SUCCEEDED;
          await payment.save();
        }

        this.bookingClient.emit('payment.succeeded', { bookingId });
      } else if (stripeEvent.type === 'payment_intent.payment_failed') {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        const payment = await this.paymentRepository.findOne({
          paymentIntentId: paymentIntent.id,
        });

        if (payment) {
          payment.status = PaymentStatus.FAILED;
          await payment.save();
        }
      }
    } catch (err) {
      console.error(err);
      return { received: false };
    }

    return { received: true };
  }
}
