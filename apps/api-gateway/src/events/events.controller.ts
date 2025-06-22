import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('events')
export class EventsController {
  constructor(@Inject('EVENT_SERVICE') private client: ClientProxy) {}

  @Get()
  findAll() {
    return this.client.send({ cmd: 'events.findAll' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send({ cmd: 'events.findOne' }, { id });
  }
}
