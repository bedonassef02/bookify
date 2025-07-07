import { Injectable } from '@nestjs/common';
import { BookDto, RpcConflictException } from '@app/shared';
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

  findAllByUser(user: string): Promise<BookingDocument[]> {
    return this.bookingRepository.findAllByUser(user);
  }

  findAllByEvent(event: string): Promise<BookingDocument[]> {
    return this.bookingRepository.findAllByEvent(event);
  }

  async bookSeats(bookDto: BookDto): Promise<BookingDocument> {
    const seats: number = await this.eventService.getBookedSeats(bookDto.event);

    const booking = await this.bookingRepository.findByUser(
      bookDto.event,
      bookDto.user,
    );

    if (booking) {
      throw new RpcConflictException(
        'User already has a booking for this event',
      );
    }

    this.eventService.updateBookedSeats(bookDto.event, seats);

    return this.bookingRepository.create(bookDto);
  }

  async cancelManyByEvent(event: string): Promise<void> {
    const bookings = await this.bookingRepository.cancelManyByEvent(event);
    const ids = bookings.map((booking) => booking.user);
    const emails: string[] = await this.userService.findEmails(ids);

    this.notificationService.cancel(emails, event);
  }
}
