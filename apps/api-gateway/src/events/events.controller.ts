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
  UseInterceptors,
  UploadedFiles,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from '../common/file-storage/files-validation-factory';
import { CloudinaryService } from '../common/file-storage/services/cloudinary/cloudinary.service';
import { MaxFileCount } from '../common/file-storage/constants/file-count.const';

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

  @Public()
  @Post(':id/upload')
  @UseInterceptors(FilesInterceptor('files', MaxFileCount.EVENT_IMAGES))
  uploadFile(
    @Param('id', ParseMongoIdPipe) id: string,
    @UploadedFiles(createParseFilePipe('2MB', ['png', 'jpeg']))
    files: Express.Multer.File[],
  ) {
    return Promise.all(
      files.map((file) => this.cloudinaryService.uploadFile(file)),
    );
  }

  @Patch(':id/publish')
  @Roles(Role.ADMIN)
  publish(@Param('id', ParseMongoIdPipe) id: string): Observable<EventType> {
    return this.client.send(Patterns.EVENTS.UPDATE, {
      id,
      eventDto: { isActive: true },
    });
  }

  @Roles(Role.ADMIN)
  @Get(':id/bookings')
  findBookingsByEvent(@Param('id', ParseMongoIdPipe) id: string) {
    return this.client.send(Patterns.BOOKING.FIND_ALL_BY_EVENT, { id });
  }
}
