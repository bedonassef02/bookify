import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { BookingDocument } from '../entities/booking.entity';
import { BookDto } from '@app/shared';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async bookSeats(bookDto: BookDto): Promise<BookingDocument | null> {
    const booking = await this.bookingRepository.findByUser(
      bookDto.event,
      bookDto.user,
    );

    if (booking) {
      booking.seats += bookDto.seats;
      return booking.save();
    }

    return this.bookingRepository.bookSeats(bookDto);
  }

  async cancelBooking(bookDto: BookDto): Promise<BookingDocument | null> {
    const booking = await this.bookingRepository.findByUser(
      bookDto.event,
      bookDto.user,
    );

    if (!booking) {
      return null;
    }

    if (booking.seats > bookDto.seats) {
      booking.seats -= bookDto.seats;
      return booking.save();
    }

    return this.bookingRepository.delete((booking._id as string).toString());
  }
}
