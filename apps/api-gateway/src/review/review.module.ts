import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ClientModule, REVIEW_QUEUE, REVIEW_SERVICE } from '@app/shared';

@Module({
  imports: [
    ClientModule.register({ name: REVIEW_SERVICE, queue: REVIEW_QUEUE }),
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
