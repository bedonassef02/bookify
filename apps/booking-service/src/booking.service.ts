import { Inject, Injectable } from '@nestjs/common';
import {
  BookDto,
  Patterns,
  RpcBadRequestException,
  RpcNotFoundException,
} from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BookingRepository } from './repositories/booking.repository';
import { BookingDocument } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    @Inject('EVENT_SERVICE') private client: ClientProxy,
  ) {}

  findAllByUser(user: string): Promise<BookingDocument[]> {
    return this.bookingRepository.findAllByUser(user);
  }

  async bookSeats(bookDto: BookDto): Promise<BookingDocument> {
    const canBook = await this.canBook(bookDto.event, bookDto.seats);

    if (!canBook) {
      throw new RpcBadRequestException(`Not enough available seats`);
    }

    const booking = await this.bookingRepository.findByUser(
      bookDto.event,
      bookDto.user,
    );

    if (booking) {
      booking.seats += bookDto.seats;
      await firstValueFrom(
        this.client.send(Patterns.EVENTS.UPDATE, {
          id: bookDto.event,
          eventDto: { bookedSeats: booking.seats },
        }),
      );

      return booking.save();
    }

    return this.bookingRepository.create(bookDto);
  }

  private async canBook(event: string, seats: number): Promise<boolean> {
    const existingEvent = await firstValueFrom(
      this.client.send(Patterns.EVENTS.FIND_ONE, { id: event }),
    );

    if (!existingEvent) {
      throw new RpcNotFoundException(`Event with ID ${event} not found`);
    }

    return existingEvent.capacity - existingEvent.bookedSeats >= seats;
  }

  deleteManyByEvent(event: string): Promise<BookingDocument[]> {
    return this.bookingRepository.deleteManyByEvent(event);
  }
}
