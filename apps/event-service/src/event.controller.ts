import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import { UpdateEventDto } from './dto/update-event.dto';

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
  async create(eventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(eventDto);
  }

  @MessagePattern({ cmd: 'events.update' })
  async update(data: { id: string; eventDto: UpdateEventDto }): Promise<Event> {
    return this.eventService.update(data.id, data.eventDto);
  }

  @MessagePattern({ cmd: 'events.remove' })
  async remove(data: { id: string }): Promise<Event | null> {
    return this.eventService.remove(data.id);
  }
}
