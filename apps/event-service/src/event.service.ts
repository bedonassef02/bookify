import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(eventDto: CreateEventDto): Promise<Event> {
    return this.eventModel.create(eventDto);
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Event | null> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Event with ID ${id} not found`,
      });
    }
    return event;
  }

  async update(id: string, eventDto: UpdateEventDto): Promise<Event> {
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, eventDto, { new: true })
      .exec();

    if (!updatedEvent) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Event with ID ${id} not found`,
      });
    }

    return updatedEvent;
  }

  async remove(id: string): Promise<Event | null> {
    return this.eventModel.findByIdAndDelete(id).exec();
  }
}
