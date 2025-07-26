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
import { CqrsModule } from '@nestjs/cqrs';
import { CreateReviewHandler } from './commands/create-review.handler';
import { UpdateReviewHandler } from './commands/update-review.handler';
import { DeleteReviewHandler } from './commands/delete-review.handler';
import { FindAllReviewsHandler } from './queries/find-all-reviews.handler';
import { EventService } from './services/event.service';

const commandHandlers = [
  CreateReviewHandler,
  UpdateReviewHandler,
  DeleteReviewHandler,
];
const queryHandlers = [FindAllReviewsHandler];

@Module({
  imports: [
    CoreModule,
    DatabaseModule.register({ dbName: 'reviewsdb' }),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ClientModule.register({ name: EVENT_SERVICE, queue: REVIEW_QUEUE }),
    CqrsModule,
  ],
  providers: [
    ReviewRepository,
    EventService,
    ...commandHandlers,
    ...queryHandlers,
  ],
  controllers: [ReviewController],
})
export class AppModule {}
