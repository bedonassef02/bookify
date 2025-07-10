import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventDto, UpdateEventDto, Patterns } from '@app/shared';
import { Event } from './entities/event.entity';
import { QueryDto } from '@app/shared';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern(Patterns.EVENTS.FIND_ALL)
  async findAll(@Payload() query: QueryDto): Promise<Event[]> {
    return this.eventService.findAll(new QueryDto(query));
  }

  @MessagePattern(Patterns.EVENTS.FIND_ONE)
  async findOne(@Payload('id') id: string): Promise<Event | null> {
    return this.eventService.findOne(id);
  }

  @MessagePattern(Patterns.EVENTS.CREATE)
  async create(eventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(eventDto);
  }

  @MessagePattern(Patterns.EVENTS.UPDATE)
  async update(
    @Payload('id') id: string,
    @Payload('eventDto') eventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.update(id, eventDto);
  }

  @MessagePattern(Patterns.EVENTS.REMOVE)
  async remove(@Payload('id') id: string): Promise<Event> {
    return this.eventService.remove(id);
  }
}
