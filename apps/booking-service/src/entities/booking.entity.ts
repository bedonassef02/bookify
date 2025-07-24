import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookingStatus } from '@app/shared';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, required: true })
  event: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  ticketTier: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  user: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Prop({ type: String, nullable: true })
  paymentIntentId: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
