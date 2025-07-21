import { Injectable } from '@nestjs/common';
import {
  BookDto,
  RpcBadRequestException,
  RpcConflictException,
  RpcNotFoundException,
  BookingStatus,
} from '@app/shared';
import { BookingRepository } from './repositories/booking.repository';
import { BookingDocument } from './entities/booking.entity';
import { NotificationService } from './mailer/notification.service';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { TicketTierService } from './services/ticket-tier.service';

@Injectable()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private eventService: EventService,
    private userService: UserService,
    private notificationService: NotificationService,
    private ticketTierService: TicketTierService,
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

  async bookSeats(bookDto: BookDto): Promise<BookingDocument> {
    const existingBooking = await this.bookingRepository.findByUser(
      bookDto.event,
      bookDto.user,
    );
    if (existingBooking) {
      throw new RpcConflictException(
        'User already has a booking for this event',
      );
    }

    const event = await this.eventService.findOne(bookDto.event);
    if (event.date <= new Date()) {
      throw new RpcBadRequestException('Cannot book tickets for past events');
    }

    const ticketTier = await this.ticketTierService.findOne(bookDto.ticketTier);

    if (ticketTier.event.toString() !== bookDto.event) {
      throw new RpcBadRequestException(
        'Ticket tier does not belong to this event',
      );
    }

    if (ticketTier.capacity <= ticketTier.bookedSeats) {
      throw new RpcBadRequestException(
        'No available seats for this ticket tier',
      );
    }

    this.ticketTierService.updateBookedSeats(ticketTier._id.toString(), 1);

    return this.bookingRepository.create(bookDto);
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
}
