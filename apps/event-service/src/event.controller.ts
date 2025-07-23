import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateEventDto,
  UpdateEventDto,
  Patterns,
  EventQuery,
} from '@app/shared';
import { Event } from './entities/event.entity';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern(Patterns.EVENTS.FIND_ALL)
  async findAll(@Payload() query: EventQuery): Promise<Event[]> {
    return this.eventService.findAll(new EventQuery(query));
  }

  @MessagePattern(Patterns.EVENTS.FIND_ONE)
  async findOne(@Payload('id') id: string): Promise<Event | null> {
    return this.eventService.findOne(id);
  }

  @MessagePattern(Patterns.EVENTS.CREATE)
  async create(@Payload() eventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(eventDto);
  }

  @MessagePattern(Patterns.EVENTS.UPDATE)
  async update(
    @Payload('id') id: string,
    @Payload('eventDto') eventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.update(id, eventDto);
  }
}
