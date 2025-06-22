import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { ClientProxy } from '@nestjs/microservices';
import { CreateEventDto } from '../../../event-service/src/dto/create-event.dto';
import { Observable } from 'rxjs';
import { UpdateEventDto } from '../../../event-service/src/dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(@Inject('EVENT_SERVICE') private client: ClientProxy) {}

  @Get()
  findAll() {
    return this.client.send({ cmd: 'events.findAll' }, {});
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string): Observable<Event | null> {
    return this.client.send({ cmd: 'events.findOne' }, { id });
  }

  @Post()
  create(@Body() eventDto: CreateEventDto) {
    return this.client.send({ cmd: 'events.create' }, eventDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() eventDto: UpdateEventDto,
  ) {
    return this.client.send({ cmd: 'events.update' }, { id, eventDto });
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.client.send({ cmd: 'events.remove' }, { id });
  }
}
