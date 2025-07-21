import { Types } from 'mongoose';
import { EventType } from './event.type';

export interface TicketTierType {
  _id: Types.ObjectId;
  name: string;
  price: number;
  capacity: number;
  bookedSeats: number;
  event: Types.ObjectId | EventType;
}
