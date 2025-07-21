import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class TicketTier extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: 0 })
  bookedSeats: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  event: MongooseSchema.Types.ObjectId;
}

export const TicketTierSchema = SchemaFactory.createForClass(TicketTier);
