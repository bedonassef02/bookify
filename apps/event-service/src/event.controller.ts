import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateEventDto, UpdateEventDto, Patterns } from '@app/shared';
import { Event } from './entities/event.entity';
import { QueryDto } from '@app/shared';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern(Patterns.EVENTS.FIND_ALL)
  async findAll(query: QueryDto): Promise<Event[]> {
    return this.eventService.findAll(new QueryDto(query));
  }

  @MessagePattern(Patterns.EVENTS.FIND_ONE)
  async findOne(data: { id: string }): Promise<Event | null> {
    return this.eventService.findOne(data.id);
  }

  @MessagePattern(Patterns.EVENTS.CREATE)
  async create(eventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(eventDto);
  }

  @MessagePattern(Patterns.EVENTS.UPDATE)
  async update(data: { id: string; eventDto: UpdateEventDto }): Promise<Event> {
    return this.eventService.update(data.id, data.eventDto);
  }

  @MessagePattern(Patterns.EVENTS.REMOVE)
  async remove(data: { id: string }): Promise<Event | null> {
    return this.eventService.remove(data.id);
  }
}
