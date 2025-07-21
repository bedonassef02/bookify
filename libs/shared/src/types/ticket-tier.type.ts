import { Types } from 'mongoose';

export interface TicketTierType {
  _id: Types.ObjectId;
  name: string;
  price: number;
  capacity: number;
  bookedSeats: number;
  event: Types.ObjectId;
}
