import { Injectable } from '@nestjs/common';
import {
  CreateEventDto,
  RpcNotFoundException,
  UpdateEventDto,
  QueryDto,
} from '@app/shared';
import { EventRepository } from './repositories/event.repository';
import { Event } from './entities/event.entity';
import { BookingService } from './booking/booking.service';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private bookingService: BookingService,
  ) {}

  create(eventDto: CreateEventDto): Promise<Event> {
    return this.eventRepository.create(eventDto);
  }

  findAll(query: QueryDto): Promise<Event[]> {
    return this.eventRepository.findAll(query);
  }

  async findOne(slug: string): Promise<Event> {
    const event = await this.eventRepository.findBySlug(slug);
    if (!event) {
      throw new RpcNotFoundException(`Event not found`);
    }

    return event;
  }

  async update(id: string, eventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.update(id, eventDto);
    if (!event) {
      throw new RpcNotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async remove(id: string): Promise<Event> {
    const event = await this.eventRepository.delete(id);
    if (!event) {
      throw new RpcNotFoundException(`Event with ID ${id} not found`);
    }

    this.bookingService.cancelManyByEvent(id);

    return event;
  }
}
