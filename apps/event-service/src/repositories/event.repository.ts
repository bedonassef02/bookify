import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../entities/event.entity';
import { BaseRepository } from '@app/shared';

@Injectable()
export class EventRepository extends BaseRepository<EventDocument> {
  constructor(@InjectModel(Event.name) eventModel: Model<EventDocument>) {
    super(eventModel);
  }
}
