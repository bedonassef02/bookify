import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ cmd: 'events.findAll' })
  findAll(): [] {
    return this.eventService.findAll();
  }

  @MessagePattern({ cmd: 'events.findOne' })
  findOne(data: { id: string }): string {
    return this.eventService.findOne(data.id);
  }
}
