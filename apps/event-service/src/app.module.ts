import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Event, EventSchema } from './entities/event.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { EventRepository } from './repositories/event.repository';
import { DatabaseModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    CacheModule.register(),
    DatabaseModule.register({ dbName: 'eventdb' }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class AppModule {}
