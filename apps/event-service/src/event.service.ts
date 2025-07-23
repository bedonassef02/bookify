import { Injectable } from '@nestjs/common';
import {
  CreateEventDto,
  RpcNotFoundException,
  UpdateEventDto,
  QueryDto,
  EventStatus,
} from '@app/shared';
import { EventRepository } from './repositories/event.repository';
import { Event } from './entities/event.entity';
import { BookingService } from './booking/booking.service';
import { CategoryRepository } from './repositories/category.repository';
import { isMongoId } from 'class-validator';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly categoryRepository: CategoryRepository,
    private bookingService: BookingService,
  ) {}

  async create(eventDto: CreateEventDto): Promise<Event> {
    if (eventDto.category) {
      await this.validateCategory(eventDto.category);
    }
    return this.eventRepository.create(eventDto);
  }

  findAll(query: QueryDto): Promise<Event[]> {
    return this.eventRepository.findAll(query);
  }

  async findOne(id: string): Promise<Event> {
    let event = await this.eventRepository.findBySlug(id);
    if (!event && isMongoId(id)) {
      event = await this.eventRepository.findById(id);
    }

    if (!event) {
      throw new RpcNotFoundException(`Event not found`);
    }

    return event;
  }

  async update(id: string, eventDto: UpdateEventDto): Promise<Event> {
    if (eventDto.category) {
      await this.validateCategory(eventDto.category);
    }

    const event = await this.eventRepository.update(id, eventDto);
    if (!event) {
      throw new RpcNotFoundException(`Event with ID ${id} not found`);
    }

    if (eventDto.status === EventStatus.CANCELED) {
      this.bookingService.cancelMany(id);
    }

    return event;
  }

  private async validateCategory(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new RpcNotFoundException('Category not found');
    }
  }
}
