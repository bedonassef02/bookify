import { Injectable } from '@nestjs/common';
import { CreateReviewDto, UpdateReviewDto } from '@app/shared';
import { ReviewRepository } from './repositories/review.repository';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  create(createReviewDto: CreateReviewDto) {
    return this.reviewRepository.create(createReviewDto);
  }

  findAll() {
    return this.reviewRepository.findAll();
  }

  findOne(id: string) {
    return this.reviewRepository.findById(id);
  }

  update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.reviewRepository.update(id, updateReviewDto);
  }

  remove(id: string) {
    return this.reviewRepository.delete(id);
  }
}
