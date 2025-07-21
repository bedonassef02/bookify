import { EventStatus } from '@app/shared/enums';

export type EventType = {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
  location: string;
  capacity: number;
  bookedSeats: number;
  status: EventStatus;
};
