import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  async create(eventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(eventDto);
    return createdEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventModel.findById(id).exec();
  }

  async update(id: string, eventDto: UpdateEventDto): Promise<Event | null> {
    return this.eventModel
      .findByIdAndUpdate(id, eventDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Event | null> {
    return this.eventModel.findByIdAndDelete(id).exec();
  }
}
