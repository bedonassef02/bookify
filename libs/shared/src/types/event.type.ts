import { EventStatus } from '@app/shared/enums';

export type EventType = {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
  location: string;
  status: EventStatus;
  category: string;
};
