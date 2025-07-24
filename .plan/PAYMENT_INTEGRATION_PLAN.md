# Payment Service Integration Plan

This document outlines the steps to implement a fully functional payment service and integrate it with the `booking-service` and `api-gateway`. We will use Stripe as the payment provider for this implementation.

### High-Level Strategy

1.  **User Initiates Booking**: A user requests to book an event.
2.  **Create Pending Booking**: The `booking-service` creates a booking record with a `status` of `PENDING`.
3.  **Initiate Payment**: The `api-gateway` calls the `payment-service` to create a payment intent with the booking details.
4.  **Client-Side Payment**: The client uses the payment intent to process the payment with Stripe.
5.  **Payment Confirmation**: Stripe sends a webhook to the `payment-service` upon successful payment.
6.  **Update Booking Status**: The `payment-service` receives the webhook, verifies the payment, and sends an event to the `booking-service` to update the booking `status` to `CONFIRMED`.
7.  **Notify User**: The `booking-service` then notifies the user of the successful booking.

---

### Phase 1: Enhance `booking-service`

The `booking-service` needs to be aware of the payment status.

1.  **Update Booking Entity**: Modify `apps/booking-service/src/entities/booking.entity.ts` to include a `status` field and a `paymentIntentId`.

    ```typescript
    // apps/booking-service/src/entities/booking.entity.ts
    import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

    export enum BookingStatus {
      PENDING = 'pending',
      CONFIRMED = 'confirmed',
      CANCELLED = 'cancelled',
      FAILED = 'failed',
    }

    @Entity()
    export class Booking {
      // ... existing fields
      @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
      status: BookingStatus;

      @Column({ nullable: true })
      paymentIntentId: string;
    }
    ```

2.  **Update Booking Creation Logic**: In `apps/booking-service/src/booking.service.ts`, ensure new bookings are saved with the `PENDING` status.

3.  **Create Event Listener for Confirmation**: In `apps/booking-service/src/booking.controller.ts`, add a method to handle an event for payment confirmation.

    ```typescript
    // apps/booking-service/src/booking.controller.ts
    import { EventPattern, Payload } from '@nestjs/microservices';
    // ...

    @Controller()
    export class BookingController {
      // ... existing methods

      @EventPattern('payment.succeeded')
      async handlePaymentSucceeded(@Payload() data: { bookingId: string }) {
        return this.bookingService.confirmBooking(data.bookingId);
      }
    }
    ```

    In `booking.service.ts`, implement the `confirmBooking` method to update the status to `CONFIRMED`.

### Phase 2: Implement `payment-service`

This service will handle all interactions with Stripe.

1.  **Install Dependencies**: Add `@nestjs/config` and `stripe`.

2.  **Configuration**: Set up Stripe API keys using `@nestjs/config`.

3.  **Create Payment Controller**: In `apps/payment-service/src/payment.controller.ts`, create two main endpoints:
    *   An RPC method to create a payment intent.
    *   A public webhook endpoint to receive events from Stripe.

    ```typescript
    // apps/payment-service/src/payment.controller.ts
    import { Controller, Post, Body, Headers } from '@nestjs/common';
    import { MessagePattern, Payload } from '@nestjs/microservices';
    import { PaymentService } from './payment.service';

    @Controller('payment')
    export class PaymentController {
      constructor(private readonly paymentService: PaymentService) {}

      @MessagePattern('payment.create_intent')
      createPaymentIntent(@Payload() data: { amount: number; currency: string; bookingId: string }) {
        return this.paymentService.createPaymentIntent(data.amount, data.currency, data.bookingId);
      }

      @Post('webhook')
      handleStripeWebhook(@Body() event: any, @Headers('stripe-signature') signature: string) {
        return this.paymentService.handleWebhook(event, signature);
      }
    }
    ```

4.  **Implement Payment Service Logic**: In `apps/payment-service/src/payment.service.ts`, write the core logic:
    *   `createPaymentIntent`: Creates a Stripe PaymentIntent and associates it with our internal `bookingId`.
    *   `handleWebhook`: Verifies the webhook signature, and if the event is `payment_intent.succeeded`, it emits a `payment.succeeded` event to the `booking-service`.

5.  **Inter-Service Communication**: Configure `ClientsModule` in `apps/payment-service/src/app.module.ts` to allow communication with the `booking-service`.

### Phase 3: Integrate with `api-gateway`

The gateway will expose the payment functionality to the client.

1.  **Create `payment` Module**: Create `apps/api-gateway/src/payment/app.module.ts` and `payment.controller.ts`.

2.  **Configure `ClientsModule`**: In `app.module.ts`, import and configure `ClientsModule` to connect to the `PAYMENT_SERVICE`.

3.  **Implement Payment Controller**: The `apps/api-gateway/src/payment/payment.controller.ts` will proxy requests to the `payment-service`.

    ```typescript
    // apps/api-gateway/src/payment/payment.controller.ts
    import { Controller, Post, Body, Inject } from '@nestjs/common';
    import { ClientProxy } from '@nestjs/microservices';

    @Controller('payment')
    export class PaymentController {
      constructor(@Inject('PAYMENT_SERVICE') private readonly client: ClientProxy) {}

      @Post('create-intent')
      createPaymentIntent(@Body() data: { amount: number; currency: string; bookingId: string }) {
        return this.client.send('payment.create_intent', data);
      }
    }
    ```

4.  **Update `booking` Flow**: The `api-gateway`'s `booking.controller.ts` should be updated. After creating a booking and getting a `bookingId`, it should immediately call the new `payment/create-intent` endpoint to get a `client_secret` for the frontend.

### Phase 4: Final Wiring

1.  **Update `docker-compose.yml`**: Add the `payment-service` to the docker-compose file so it runs alongside the other services.
2.  **Environment Variables**: Ensure all services have the necessary environment variables, especially for Stripe keys and inter-service communication.
3.  **Testing**: Create end-to-end tests to simulate the entire booking and payment flow.
