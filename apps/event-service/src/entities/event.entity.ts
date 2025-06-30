import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event &
  Document & {
    isFull(): boolean;
    availableSeats(): number;
    bookSeats(seats: number): boolean;
    cancelBooking(seats: number): boolean;
  };

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, required: true })
  organizerId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop({ required: true, default: 0 })
  bookedSeats: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.methods.isFull = function (): boolean {
  return this.bookedSeats >= this.capacity;
};

EventSchema.methods.availableSeats = function (): number {
  return this.capacity - this.bookedSeats;
};

EventSchema.methods.bookSeats = function (seats: number): boolean {
  if (!this.isActive || this.isFull() || this.availableSeats() < seats) {
    return false;
  }
  this.bookedSeats += seats;
  return true;
};

EventSchema.methods.cancelBooking = function (seats: number): boolean {
  if (this.bookedSeats - seats < 0) {
    return false;
  }
  this.bookedSeats -= seats;
  return true;
};
