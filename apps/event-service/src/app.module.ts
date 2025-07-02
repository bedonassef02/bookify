import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClientModule, DatabaseModule, LoggingInterceptor } from '@app/shared';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './repositories/event.repository';
import { Event, EventSchema } from './entities/event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    CacheModule.register(),
    ClientModule.register({
      name: 'BOOKING_SERVICE',
      queue: 'booking_queue',
    }),
    DatabaseModule.register({ dbName: 'eventdb' }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    EventRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
