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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { ClientProxy } from '@nestjs/microservices';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateEventDto, PATTERNS, UpdateEventDto } from '@app/shared';

@ApiTags('events')
@Controller('events')
@UseInterceptors(CacheInterceptor)
export class EventsController {
  constructor(@Inject('EVENT_SERVICE') private client: ClientProxy) {}

  @Get()
  @ApiOperation({
    summary: 'Get all events',
    description:
      'Retrieves a list of all events. Results are cached for performance.',
  })
  @ApiOkResponse({
    description: 'List of events retrieved successfully',
  })
  @CacheKey('events')
  findAll() {
    return this.client.send(PATTERNS.EVENTS.FIND_ALL, {});
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get event by ID',
    description: 'Retrieves a single event by its MongoDB ObjectId',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the event',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Event found',
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format',
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string): Observable<Event | null> {
    return this.client.send(PATTERNS.EVENTS.FIND_ONE, { id });
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new event',
    description: 'Creates a new event with the provided information',
  })
  @ApiCreatedResponse({
    description: 'Event created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() eventDto: CreateEventDto) {
    return this.client.send(PATTERNS.EVENTS.CREATE, eventDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an event',
    description: 'Updates an existing event with partial data',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the event to update',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Event updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or ID format',
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() eventDto: UpdateEventDto,
  ) {
    return this.client.send(PATTERNS.EVENTS.UPDATE, { id, eventDto });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an event',
    description: 'Permanently deletes an event by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the event to delete',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Event deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.client.send(PATTERNS.EVENTS.REMOVE, { id });
  }
}
