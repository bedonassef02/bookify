import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RpcException } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(eventDto: CreateEventDto): Promise<Event> {
    const createdEvent = await this.eventModel.create(eventDto);
    await this.cacheManager.del('events');
    return createdEvent;
  }

  async findAll(): Promise<Event[]> {
    const cached = await this.cacheManager.get<Event[]>('events');
    if (cached) return cached;

    const events = await this.eventModel.find().exec();
    await this.cacheManager.set('events', events, 30000);
    return events;
  }

  async findOne(id: string): Promise<Event> {
    const cached = await this.cacheManager.get<Event>(`event_${id}`);
    if (cached) return cached;

    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Event with ID ${id} not found`,
      });
    }

    await this.cacheManager.set(`event_${id}`, event, 30000);
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

    await this.cacheManager.set(`event_${id}`, updatedEvent, 30000);
    await this.cacheManager.del('events');

    return updatedEvent;
  }

  async remove(id: string): Promise<Event | null> {
    const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
    if (deletedEvent) {
      await this.cacheManager.del(`event_${id}`);
      await this.cacheManager.del('events');
    }
    return deletedEvent;
  }
}