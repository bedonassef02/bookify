import { Injectable, Inject } from '@nestjs/common';
import {
  BookDto,
  RpcBadRequestException,
  RpcConflictException,
  RpcNotFoundException,
  BookingStatus,
  PAYMENT_SERVICE,
  Patterns,
  EventType,
  NOTIFICATION_SERVICE,
} from '@app/shared';
import { BookingRepository } from './repositories/booking.repository';
import { BookingDocument } from './entities/booking.entity';
import { NotificationService } from './mailer/notification.service';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { TicketTierService } from './services/ticket-tier.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private eventService: EventService,
    private userService: UserService,
    private notificationService: NotificationService,
    private ticketTierService: TicketTierService,
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {}

  async findOne(id: string, user: string): Promise<BookingDocument> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking || booking.user.toString() !== user) {
      throw new RpcNotFoundException('Booking not found');
    }
    return booking;
  }

  findAllByUser(user: string): Promise<BookingDocument[]> {
    return this.bookingRepository.findAllByUser(user);
  }

  async bookSeats(bookDto: BookDto): Promise<any> {
    const existingBooking = await this.bookingRepository.findByUser(
      bookDto.event,
      bookDto.user,
    );
    if (existingBooking) {
      throw new RpcConflictException(
        'User already has a booking for this event',
      );
    }

    const event: EventType = await this.eventService.findOne(bookDto.event);
    if (event.date <= new Date()) {
      throw new RpcBadRequestException('Cannot book tickets for past events');
    }

    const ticketTier = await this.ticketTierService.findOne(
      bookDto.ticketTier,
      bookDto.event,
    );

    if (ticketTier.capacity <= ticketTier.bookedSeats) {
      throw new RpcBadRequestException(
        'No available seats for this ticket tier',
      );
    }

    this.ticketTierService.updateBookedSeats(ticketTier._id.toString(), 1);

    const totalPrice = ticketTier.price;

    const booking = await this.bookingRepository.create({
      ...bookDto,
      totalPrice,
    });

    const paymentIntent = await firstValueFrom(
      this.paymentClient.send(Patterns.PAYMENTS.CREATE_INTENT, {
        amount: totalPrice,
        currency: 'usd',
        bookingId: booking._id,
      }),
    );

    return { ...booking.toObject(), ...paymentIntent };
  }

  async cancel(id: string, userId: string): Promise<BookingDocument> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking || booking.user.toString() !== userId) {
      throw new RpcNotFoundException('Booking not found or not authorized');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new RpcBadRequestException('Booking is already cancelled');
    }

    const event = await this.eventService.findOne(booking.event.toString());
    if (event.date <= new Date()) {
      throw new RpcBadRequestException('Cannot cancel booking for past events');
    }

    const cancelledBooking = await this.bookingRepository.cancel(id, userId);

    const ticketTier = await this.ticketTierService.findOne(
      booking.ticketTier.toString(),
      booking.event.toString(),
    );
    this.ticketTierService.updateBookedSeats(ticketTier._id.toString(), -1);

    return cancelledBooking as BookingDocument;
  }

  async cancelMany(event: string): Promise<void> {
    const bookings = await this.bookingRepository.cancelMany(event);
    if (bookings.length === 0) {
      return;
    }

    const userIds = bookings.map((booking) => booking.user);
    const emails: string[] = await this.userService.findEmails(userIds);

    const eventDetails = await this.eventService.findOne(event);
    this.notificationService.cancel(emails, eventDetails.title);
  }

  async confirm(id: string): Promise<BookingDocument> {
    const booking = await this.bookingRepository.update(id, {
      status: BookingStatus.CONFIRMED,
    });
    if (!booking) {
      throw new RpcNotFoundException('Booking not found');
    }

    return booking;
  }

  async handlePaymentSucceeded(bookingId: string, paymentIntentId: string) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      console.warn(`Booking with ID ${bookingId} not found.`);
      return;
    }

    // Idempotency check: If paymentIntentId is already set and status is CONFIRMED,
    // or if another booking already has this paymentIntentId, do nothing.
    if (
      booking.paymentIntentId === paymentIntentId &&
      booking.status === BookingStatus.CONFIRMED
    ) {
      console.log(
        `Payment for booking ${bookingId} (intent ${paymentIntentId}) already processed.`,
      );
      return;
    }

    // Optional: Check if this paymentIntentId is already associated with another booking
    // This prevents a single payment intent from confirming multiple bookings
    const existingBookingWithIntent = await this.bookingRepository.findOne({
      paymentIntentId,
    });
    if (
      existingBookingWithIntent &&
      existingBookingWithIntent._id.toString() !== bookingId
    ) {
      console.warn(
        `Payment Intent ${paymentIntentId} already used for booking ${existingBookingWithIntent._id}. Skipping processing for booking ${bookingId}.`,
      );
      return;
    }

    booking.status = BookingStatus.CONFIRMED;
    booking.paymentIntentId = paymentIntentId; // Store the payment intent ID
    await booking.save();

    // Emit notification for confirmed booking
    this.notificationClient.emit('booking.confirmed', {
      bookingId: booking._id,
    });
  }
}
