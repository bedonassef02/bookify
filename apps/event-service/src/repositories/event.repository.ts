import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../entities/event.entity';
import { Repository } from '@app/shared';

@Injectable()
export class EventRepository extends Repository<Event> {
  constructor(@InjectModel(Event.name) eventModel: Model<Event>) {
    super(eventModel);
  }

  findBySlug(slug: string): Promise<Event | null> {
    return this.model.findOne({ slug }).exec();
  }
}
