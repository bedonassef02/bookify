import { Module } from '@nestjs/common';
import {
  ClientModule,
  CoreModule,
  DatabaseModule,
  EVENT_SERVICE,
  REVIEW_QUEUE,
} from '@app/shared';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './entities/review.entity';
import { EventService } from './services/event.service';
import { ReviewService } from './review.service';

@Module({
  imports: [
    CoreModule,
    DatabaseModule.register({ dbName: 'reviewsdb' }),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ClientModule.register({ name: EVENT_SERVICE, queue: REVIEW_QUEUE }),
  ],
  providers: [ReviewRepository, EventService, ReviewService],
  controllers: [ReviewController],
})
export class AppModule {}
