import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Patch,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { ClientProxy } from '@nestjs/microservices';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Observable } from 'rxjs';
import {
  CreateEventDto,
  EVENT_SERVICE,
  Patterns,
  UpdateEventDto,
  EventType,
  QueryDto,
  Role,
} from '@app/shared';
import { Public } from '../users/auth/decorators/public.decorator';
import { Roles } from '../users/auth/decorators/roles.decorator';

@Controller('events')
@UseInterceptors(CacheInterceptor)
export class EventsController {
  constructor(@Inject(EVENT_SERVICE) private client: ClientProxy) {}

  @Public()
  @Get()
  @CacheKey('events')
  findAll(@Query() query: QueryDto): Observable<EventType[]> {
    return this.client.send(Patterns.EVENTS.FIND_ALL, query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string): Observable<EventType> {
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

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseMongoIdPipe) id: string): Observable<void> {
    return this.client.send(Patterns.EVENTS.REMOVE, { id });
  }

  @Roles(Role.ADMIN)
  @Get(':id/bookings')
  findBookingsByEvent(@Param('id', ParseMongoIdPipe) id: string) {
    return this.client.send(Patterns.BOOKING.FIND_ALL_BY_EVENT, { id });
  }
}
