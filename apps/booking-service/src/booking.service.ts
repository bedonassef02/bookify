import { Inject, Injectable } from '@nestjs/common';
import { BookDto, Patterns, RpcConflictException } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BookingRepository } from './repositories/booking.repository';
import { BookingDocument } from './entities/booking.entity';
import { NotificationService } from './services/notification.service';
import { EventService } from './services/event.service';

@Injectable()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private eventService: EventService,
    @Inject('USER_SERVICE') private userService: ClientProxy,
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
    const emails: string[] = await firstValueFrom(
      this.userService.send(Patterns.USERS.FIND_EMAILS_BY_IDS, {
        ids: bookings.map((booking) => booking.user),
      }),
    );

    this.notificationService.cancel(emails, event);
  }
}
