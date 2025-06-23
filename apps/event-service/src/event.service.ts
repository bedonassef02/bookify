import { HttpStatus, Injectable, Inject } from '@nestjs/common';
import { CreateEventDto } from '@app/shared/dto/create-event.dto';
import { UpdateEventDto } from '@app/shared/dto/update-event.dto';
import { RpcException } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventRepository } from './repositories/event.repository';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(eventDto: CreateEventDto): Promise<Event> {
    const createdEvent = await this.eventRepository.create(eventDto);
    await this.cacheManager.del('events');
    return createdEvent;
  }

  async findAll(): Promise<Event[]> {
    const cached = await this.cacheManager.get<Event[]>('events');
    if (cached) return cached;

    const events = await this.eventRepository.findAll();
    await this.cacheManager.set('events', events, 30000);
    return events;
  }

  async findOne(id: string): Promise<Event> {
    const cached = await this.cacheManager.get<Event>(`event_${id}`);
    if (cached) return cached;

    const event = await this.eventRepository.findById(id);
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
    const updatedEvent = await this.eventRepository.update(id, eventDto);

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
    const deletedEvent = await this.eventRepository.delete(id);
    if (deletedEvent) {
      await this.cacheManager.del(`event_${id}`);
      await this.cacheManager.del('events');
    }
    return deletedEvent;
  }
}
