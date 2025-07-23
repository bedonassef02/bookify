import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CreateEventDto,
  EVENT_SERVICE,
  Patterns,
  UpdateEventDto,
  EventType,
  Role,
  EventQuery,
} from '@app/shared';
import { Public } from '../users/auth/decorators/public.decorator';
import { Roles } from '../users/auth/decorators/roles.decorator';

@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(@Inject(EVENT_SERVICE) private client: ClientProxy) {}

  @Public()
  @Get()
  findAll(@Query() query: EventQuery): Observable<EventType[]> {
    return this.client.send(Patterns.EVENTS.FIND_ALL, query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Observable<EventType> {
    return this.client.send(Patterns.EVENTS.FIND_ONE, { id });
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() eventDto: CreateEventDto): Observable<EventType> {
    return this.client.send(Patterns.EVENTS.CREATE, eventDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() eventDto: UpdateEventDto,
  ): Observable<EventType> {
    return this.client.send(Patterns.EVENTS.UPDATE, { id, eventDto });
  }
}
