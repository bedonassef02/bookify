import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BookingStatus } from '@app/shared';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
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
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
