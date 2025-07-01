import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository, RpcNotFoundException } from '@app/shared';
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

  async canBook(event: string, seats: number): Promise<boolean> {
    const existingEvent = await this.eventRepository.findById(event);
    if (!existingEvent) {
      throw new RpcNotFoundException(`Event with ID ${event} not found`);
    }

    if (!existingEvent.bookSeats(seats)) return false;

    return true;
  }

  findByUser(event: string, user: string): Promise<BookingDocument | null> {
    return this.model.findOne({ event, user });
  }
}
