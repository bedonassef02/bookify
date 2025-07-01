import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookDto, Repository, RpcNotFoundException } from '@app/shared';
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

  async bookSeats(bookDto: BookDto): Promise<BookingDocument | null> {
    const event = await this.eventRepository.findById(bookDto.event);
    if (!event || !event.bookSeats(bookDto.seats)) {
      throw new RpcNotFoundException(
        `Event with ID ${bookDto.event} not found`,
      );
    }

    return this.create(bookDto);
  }

  findByUser(event: string, user: string): Promise<BookingDocument | null> {
    return this.model.findOne({ event, user });
  }
}
