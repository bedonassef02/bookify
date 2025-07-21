import {
  Body,
  Controller,
  Delete,
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
  QueryDto,
  Role,
} from '@app/shared';
import { Public } from '../users/auth/decorators/public.decorator';
import { Roles } from '../users/auth/decorators/roles.decorator';
import { CloudinaryService } from '@app/file-storage';

@Controller('events')
export class EventsController {
  constructor(
    private cloudinaryService: CloudinaryService,
    @Inject(EVENT_SERVICE) private client: ClientProxy,
  ) {}

  @Public()
  @Get()
  findAll(@Query() query: QueryDto): Observable<EventType[]> {
    return this.client.send(Patterns.EVENTS.FIND_ALL, query);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string): Observable<EventType> {
    return this.client.send(Patterns.EVENTS.FIND_ONE, { slug });
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
