import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { BookingDocument } from '../entities/booking.entity';
import { BookDto } from '@app/shared';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  bookSeats(bookDto: BookDto): Promise<BookingDocument | null> {
    return this.bookingRepository.bookSeats(bookDto);
  }
}
