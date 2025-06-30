import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BookingStatus } from '@app/shared';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Event' })
  event: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  user: Types.ObjectId;

  @Prop({ default: 1, min: 1 })
  seats: number;

  @Prop({
    type: String,
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
