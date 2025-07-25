import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllReviewsQuery } from './find-all-reviews.query';
import { ReviewRepository } from '../repositories/review.repository';

@QueryHandler(FindAllReviewsQuery)
export class FindAllReviewsHandler
  implements IQueryHandler<FindAllReviewsQuery>
{
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute() {
    return this.reviewRepository.findAll();
  }
}
