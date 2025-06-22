import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  date: Date;
  @Prop()
  location: string;
  @Prop()
  capacity: number;
  @Prop()
  organizerId: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
