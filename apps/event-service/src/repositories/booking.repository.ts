import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '@app/shared';
import { Booking, BookingDocument } from '../entities/booking.entity';
import { EventRepository } from './event.repository';

@Injectable()
export class BookingRepository extends Repository<BookingDocument> {
  constructor(
    @InjectModel(Booking.name) bookingModel: Model<BookingDocument>,
    private readonly eventRepository: EventRepository,
  ) {
    super(bookingModel);
  }

  async bookSeats(
    id: string,
    user: string,
    seats: number,
  ): Promise<BookingDocument | null> {
    const event = await this.eventRepository.findById(id);
    if (!event || !event.bookSeats(seats)) {
      return null;
    }

    return this.create({ event: id, user, seats });
  }
}
