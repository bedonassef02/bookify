import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '@app/shared';
import { Booking, BookingDocument } from '../entities/booking.entity';

@Injectable()
export class BookingRepository extends Repository<BookingDocument> {
  constructor(@InjectModel(Booking.name) bookingModel: Model<BookingDocument>) {
    super(bookingModel);
  }

  findByUser(event: string, user: string): Promise<BookingDocument | null> {
    return this.model.findOne({ event, user });
  }

  findAllByUser(user: string): Promise<BookingDocument[]> {
    return this.model.find({ user });
  }
}
