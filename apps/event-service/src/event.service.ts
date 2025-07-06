import { Injectable, Inject } from '@nestjs/common';
import {
  CreateEventDto,
  Patterns,
  RpcNotFoundException,
  UpdateEventDto,
} from '@app/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventRepository } from './repositories/event.repository';
import { Event } from './entities/event.entity';
import { QueryDto } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('BOOKING_SERVICE') private bookingService: ClientProxy,
  ) {}

  async create(eventDto: CreateEventDto): Promise<Event> {
    const createdEvent = await this.eventRepository.create(eventDto);
    await this.cacheManager.del('events');
    return createdEvent;
  }

  async findAll(query: QueryDto): Promise<Event[]> {
    const cached = await this.cacheManager.get<Event[]>('events'); // @todo: add query params
    if (cached) return cached;

    const events = await this.eventRepository.findAll(query);
    await this.cacheManager.set('events', events, 30000);
    return events;
  }

  async findOne(id: string): Promise<Event> {
    const cached = await this.cacheManager.get<Event>(`event_${id}`);
    if (cached) return cached;

    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new RpcNotFoundException(`Event with ID ${id} not found`);
    }

    await this.cacheManager.set(`event_${id}`, event, 30000);
    return event;
  }

  async update(id: string, eventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.update(id, eventDto);

    if (!event) {
      throw new RpcNotFoundException(`Event with ID ${id} not found`);
    }

    await this.cacheManager.set(`event_${id}`, event, 30000);
    await this.cacheManager.del('events');

    return event;
  }

  async remove(id: string): Promise<Event> {
    const event = await this.eventRepository.delete(id);

    if (!event) {
      throw new RpcNotFoundException(`Event with ID ${id} not found`);
    }

    if (event) {
      await this.cacheManager.del(`event_${id}`);
      await this.cacheManager.del('events');
    }

    await firstValueFrom(
      this.bookingService.send(Patterns.BOOKING.CANCEL_MANY_BY_EVENT, {
        event: id,
      }),
    );

    return event;
  }
}
