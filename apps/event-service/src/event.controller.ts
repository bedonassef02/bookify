import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateEventDto } from '@app/shared/dto/create-event.dto';
import { Event } from './entities/event.entity';
import { UpdateEventDto } from '@app/shared/dto/update-event.dto';
import { PATTERNS } from '@app/shared';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern(PATTERNS.EVENTS.FIND_ALL)
  async findAll(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @MessagePattern(PATTERNS.EVENTS.FIND_ONE)
  async findOne(data: { id: string }): Promise<Event | null> {
    return this.eventService.findOne(data.id);
  }

  @MessagePattern(PATTERNS.EVENTS.CREATE)
  async create(eventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(eventDto);
  }

  @MessagePattern(PATTERNS.EVENTS.UPDATE)
  async update(data: { id: string; eventDto: UpdateEventDto }): Promise<Event> {
    return this.eventService.update(data.id, data.eventDto);
  }

  @MessagePattern(PATTERNS.EVENTS.REMOVE)
  async remove(data: { id: string }): Promise<Event | null> {
    return this.eventService.remove(data.id);
  }
}
