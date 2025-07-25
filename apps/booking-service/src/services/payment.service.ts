import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Patterns, PAYMENT_SERVICE } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  constructor(@Inject(PAYMENT_SERVICE) private client: ClientProxy) {}

  createIntent(bookingId: string, amount: number) {
    return firstValueFrom(
      this.client.send(Patterns.PAYMENTS.CREATE_INTENT, {
        amount,
        currency: 'usd',
        bookingId,
      }),
    );
  }
}
