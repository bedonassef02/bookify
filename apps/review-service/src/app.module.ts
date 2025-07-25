import { Module } from '@nestjs/common';
import { CoreModule, DatabaseModule } from '@app/shared';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './entities/review.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateReviewHandler } from './commands/create-review.handler';
import { UpdateReviewHandler } from './commands/update-review.handler';
import { DeleteReviewHandler } from './commands/delete-review.handler';
import { FindAllReviewsHandler } from './queries/find-all-reviews.handler';
import { FindOneReviewHandler } from './queries/find-one-review.handler';

const commandHandlers = [
  CreateReviewHandler,
  UpdateReviewHandler,
  DeleteReviewHandler,
];
const queryHandlers = [FindAllReviewsHandler, FindOneReviewHandler];

@Module({
  imports: [
    CoreModule,
    DatabaseModule.register({ dbName: 'reviewsdb' }),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    CqrsModule,
  ],
  providers: [ReviewRepository, ...commandHandlers, ...queryHandlers],
  controllers: [ReviewController],
})
export class AppModule {}
