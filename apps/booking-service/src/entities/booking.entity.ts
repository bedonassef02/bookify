import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BookingStatus } from '@app/shared';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ required: true })
  event: string;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  ticketTier: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING, type: String })
  status: BookingStatus;

  @Prop({ unique: true, sparse: true })
  paymentIntent?: string;

  @Prop({ required: false })
  couponCode?: string;

  @Prop({ required: false })
  discountAmount?: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
