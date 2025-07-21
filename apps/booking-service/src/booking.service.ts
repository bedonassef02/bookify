import { Injectable } from '@nestjs/common';
import {
  BookDto,
  RpcConflictException,
  RpcNotFoundException,
} from '@app/shared';
import { BookingRepository } from './repositories/booking.repository';
import { BookingDocument } from './entities/booking.entity';
import { NotificationService } from './services/notification.service';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';

@Injectable()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private eventService: EventService,
    private userService: UserService,
    private notificationService: NotificationService,
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

  findAllByEvent(event: string): Promise<BookingDocument[]> {
    return this.bookingRepository.findAllByEvent(event);
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

    const seats: number = await this.eventService.getBookedSeats(bookDto.event);
    this.eventService.updateBookedSeats(bookDto.event, seats);

    return this.bookingRepository.create(bookDto);
  }

  async cancel(id: string, userId: string): Promise<BookingDocument> {
    const booking = await this.bookingRepository.cancel(id, userId);
    if (!booking) {
      throw new RpcNotFoundException('Booking not found or not authorized');
    }
    // TODO: Notify event service to decrement booked seats
    return booking;
  }

  async cancelManyByEvent(event: string): Promise<void> {
    const bookings = await this.bookingRepository.cancelManyByEvent(event);
    const ids = bookings.map((booking) => booking.user);
    const emails: string[] = await this.userService.findEmails(ids);

    this.notificationService.cancel(emails, event);
  }
}
