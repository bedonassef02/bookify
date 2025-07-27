import { Injectable, Inject } from '@nestjs/common';
import {
  BookDto,
  RpcBadRequestException,
  RpcConflictException,
  BookingStatus,
  EventType,
  CouponType,
} from '@app/shared';
import { BookingRepository } from './repositories/booking.repository';
import { BookingDocument } from './entities/booking.entity';
import { NotificationService } from './mailer/notification.service';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { TicketTierService } from './services/ticket-tier.service';
import { PaymentService } from './services/payment.service';
import { CouponService } from './services/coupon.service';

@Injectable()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private eventService: EventService,
    private userService: UserService,
    private notificationService: NotificationService,
    private ticketTierService: TicketTierService,
    private paymentService: PaymentService,
    private couponService: CouponService,
  ) {}

  findOne(id: string, user: string): Promise<BookingDocument> {
    return this.bookingRepository.findOneOrFail({ _id: id, user });
  }

  findAllByUser(user: string): Promise<BookingDocument[]> {
    return this.bookingRepository.findAll({ user });
  }

  async bookSeats(bookDto: BookDto): Promise<any> {
    await this.isExist(bookDto.event, bookDto.user);

    const event: EventType = await this.eventService.findOne(bookDto.event);
    this.eventService.validate(event);

    const ticketTier = await this.ticketTierService.findOne(
      bookDto.ticketTier,
      bookDto.event,
    );
    this.ticketTierService.hasAvailableSeats(ticketTier);
    this.ticketTierService.updateBookedSeats(ticketTier.id, 1);

    let totalPrice = ticketTier.price;
    let discountAmount = 0;
    let couponCode: string | null = null;

    if (bookDto.couponCode) {
      const couponResult: {
        discountAmount: number;
        couponCode: string;
      } | null = await this._processCoupon(bookDto, totalPrice, event);
      if (couponResult) {
        discountAmount = couponResult.discountAmount;
        couponCode = couponResult.couponCode;
        totalPrice -= discountAmount;
      }
    }

    const booking = await this.bookingRepository.create({
      ...bookDto,
      totalPrice,
      couponCode,
      discountAmount,
    });

    const paymentIntent: { clientSecret: string | null } =
      await this.paymentService.createIntent(booking.id, totalPrice);

    return { ...booking.toObject(), ...paymentIntent };
  }

  async cancel(id: string, userId: string): Promise<void> {
    const booking = await this.bookingRepository.findByIdOrFail(id);
    if (booking.status === BookingStatus.CANCELLED) {
      throw new RpcBadRequestException('Booking is already cancelled');
    }

    const event = await this.eventService.findOne(booking.event);
    if (event.date <= new Date()) {
      throw new RpcBadRequestException('Cannot cancel booking for past events');
    }

    await this.bookingRepository.cancel(id, userId);

    if (booking.couponCode) {
      await this.couponService.decrementCouponUsage(booking.couponCode);
    }

    const ticketTier = await this.ticketTierService.findOne(
      booking.ticketTier,
      booking.event,
    );
    this.ticketTierService.updateBookedSeats(ticketTier.id, -1);
  }

  async cancelMany(event: string): Promise<void> {
    const bookings = await this.bookingRepository.cancelMany(event);
    if (bookings.length === 0) {
      return;
    }

    const emails: string[] = await this.findEmails(bookings);
    const eventDetails = await this.eventService.findOne(event);
    this.notificationService.cancel(emails, eventDetails.title);
  }

  async handlePaymentSucceeded(bookingId: string, paymentIntent: string) {
    const booking = await this.bookingRepository.findByIdOrFail(bookingId);

    if (
      booking.paymentIntent === paymentIntent &&
      booking.status === BookingStatus.CONFIRMED
    ) {
      throw new RpcBadRequestException(
        'Payment already confirmed for this booking',
      );
    }

    const existingBooking = await this.bookingRepository.findOne({
      paymentIntent,
    });
    if (existingBooking && existingBooking.id !== bookingId) {
      throw new RpcBadRequestException(
        'Payment already used for another booking',
      );
    }

    booking.status = BookingStatus.CONFIRMED;
    booking.paymentIntent = paymentIntent; // Store the payment intent ID
    await booking.save();

    // @todo: Emit notification for confirmed booking
  }

  private async isExist(user: string, event: string): Promise<void> {
    const booking = await this.bookingRepository.findOne({ event, user });
    if (booking) {
      throw new RpcConflictException(
        'User already has a booking for this event',
      );
    }
  }

  private findEmails(bookings: BookingDocument[]): Promise<string[]> {
    const userIds = bookings.map((booking) => booking.user);
    return this.userService.findEmails(userIds);
  }

  private async _processCoupon(
    bookDto: BookDto,
    totalPrice: number,
    event: EventType,
  ): Promise<{ discountAmount: number; couponCode: string } | null> {
    if (!bookDto.couponCode) {
      return null;
    }

    const {
      discountAmount,
      couponCode,
      coupon,
    }: { discountAmount: number; couponCode: string; coupon: CouponType } =
      await this.couponService.applyCoupon(bookDto, totalPrice, event);

    await this.couponService.incrementCouponUsage(coupon.id);

    return {
      discountAmount,
      couponCode,
    };
  }
}
