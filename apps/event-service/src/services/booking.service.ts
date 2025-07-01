import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { BookingDocument } from '../entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  bookSeats(
    id: string,
    user: string,
    seats: number,
  ): Promise<BookingDocument | null> {
    return this.bookingRepository.bookSeats(id, user, seats);
  }
}
