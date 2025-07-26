import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { BOOKING_SERVICE, CreatePaymentIntentDto, Patterns } from '@app/shared';
import Stripe from 'stripe';
import { PaymentStatus } from './entities/payment.entity';
import { PaymentRepository } from './repositories/payment.repository';

@Injectable()
export class PaymentService implements OnModuleInit {
  private readonly stripe: Stripe;
  private stripeSecret: string;
  private webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(BOOKING_SERVICE) private readonly bookingClient: ClientProxy,
    private readonly paymentRepository: PaymentRepository,
  ) {
    this.stripe = new Stripe(this.stripeSecret, {
      apiVersion: '2025-06-30.basil',
    });
  }

  async createPaymentIntent(
    paymentIntentDto: CreatePaymentIntentDto,
  ): Promise<{ clientSecret: string | null }> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: paymentIntentDto.amount * 100,
      currency: paymentIntentDto.currency,
      metadata: { bookingId: paymentIntentDto.booking },
    });

    await this.paymentRepository.create({
      paymentIntent: paymentIntent.id,
      status: PaymentStatus.PENDING,
      ...paymentIntentDto,
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(event: string | Buffer, signature: string) {
    try {
      const stripeEvent = this.stripe.webhooks.constructEvent(
        event,
        signature,
        this.webhookSecret,
      );

      if (stripeEvent.type === 'payment_intent.succeeded') {
        const paymentIntent = stripeEvent.data.object;
        const bookingId = paymentIntent.metadata.bookingId;

        const payment = await this.paymentRepository.findOne({
          paymentIntentId: paymentIntent.id,
        });
        if (payment) {
          payment.status = PaymentStatus.SUCCEEDED;
          await payment.save();
        }

        this.bookingClient.emit(Patterns.PAYMENTS.SUCCEEDED, { bookingId });
      } else if (stripeEvent.type === 'payment_intent.payment_failed') {
        const paymentIntent = stripeEvent.data.object;
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

  onModuleInit() {
    this.stripeSecret = this.configService.get<string>(
      'STRIPE_SECRET_KEY',
    ) as string;

    this.webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    ) as string;
  }
}
