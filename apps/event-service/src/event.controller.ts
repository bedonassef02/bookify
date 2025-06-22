import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ cmd: 'events.findAll' })
  async findAll(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @MessagePattern({ cmd: 'events.findOne' })
  async findOne(data: { id: string }): Promise<Event | null> {
    return this.eventService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'events.create' })
  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(createEventDto);
  }
}
