import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneReviewQuery } from './find-one-review.query';
import { ReviewRepository } from '../repositories/review.repository';

@QueryHandler(FindOneReviewQuery)
export class FindOneReviewHandler implements IQueryHandler<FindOneReviewQuery> {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(query: FindOneReviewQuery) {
    const { id } = query;
    return this.reviewRepository.findById(id);
  }
}
