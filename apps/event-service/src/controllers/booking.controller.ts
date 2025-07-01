import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Patterns } from '@app/shared';
import { BookingService } from '../services/booking.service';
import { BookingDocument } from '../entities/booking.entity';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @MessagePattern(Patterns.EVENTS.BOOK_SEATS)
  async bookSeats(data: {
    id: string;
    user: string;
    seats: number;
  }): Promise<BookingDocument | null> {
    return this.bookingService.bookSeats(data.id, data.user, data.seats);
  }
}
