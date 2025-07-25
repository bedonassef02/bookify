import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateReviewDto, UpdateReviewDto } from '@app/shared';

@Injectable()
export class ReviewService {
  constructor(@Inject('REVIEW_SERVICE') private client: ClientProxy) {}

  create(createReviewDto: CreateReviewDto) {
    return this.client.send('createReview', createReviewDto);
  }

  findAll() {
    return this.client.send('findAllReviews', {});
  }

  findOne(id: string) {
    return this.client.send('findOneReview', id);
  }

  update(updateReviewDto: UpdateReviewDto) {
    return this.client.send('updateReview', updateReviewDto);
  }

  remove(id: string) {
    return this.client.send('removeReview', id);
  }
}
