import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../entities/event.entity';
import { Repository } from '@app/shared';

@Injectable()
export class EventRepository extends Repository<EventDocument> {
  constructor(@InjectModel(Event.name) eventModel: Model<EventDocument>) {
    super(eventModel);
  }

  async bookSeats(id: string, seats: number): Promise<EventDocument | null> {
    const event = await this.findById(id);
    if (!event || !event.bookSeats(seats)) {
      return null;
    }

    return event.save();
  }
}
