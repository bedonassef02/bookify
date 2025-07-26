import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingStatus, Repository } from '@app/shared';
import { Booking, BookingDocument } from '../entities/booking.entity';

@Injectable()
export class BookingRepository extends Repository<BookingDocument> {
  constructor(@InjectModel(Booking.name) bookingModel: Model<BookingDocument>) {
    super(bookingModel);
  }

  cancel(id: string, user: string): Promise<BookingDocument | null> {
    return this.findOneAndUpdate(
      { _id: id, user },
      { status: BookingStatus.CANCELLED },
    );
  }

  async cancelMany(event: string): Promise<BookingDocument[]> {
    const bookings = await this.model.find({ event }).select('user').lean();

    await this.model.updateMany({ event }, { status: BookingStatus.CANCELLED });

    return bookings;
  }
}
