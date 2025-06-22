import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateEventDto } from '../../../event-service/src/dto/create-event.dto';
import { Observable } from 'rxjs';

@Controller('events')
export class EventsController {
  constructor(@Inject('EVENT_SERVICE') private client: ClientProxy) {}

  @Get()
  findAll() {
    return this.client.send({ cmd: 'events.findAll' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<Event | null> {
    return this.client.send({ cmd: 'events.findOne' }, { id });
  }

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.client.send({ cmd: 'events.create' }, createEventDto);
  }
}
