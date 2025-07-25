import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';
import { CreateReviewDto, Patterns, UpdateReviewDto } from '@app/shared';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern(Patterns.REVIEWS.CREATE)
  create(@Payload() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @MessagePattern(Patterns.REVIEWS.FIND_ALL)
  findAll() {
    return this.reviewService.findAll();
  }

  @MessagePattern(Patterns.REVIEWS.FIND_ONE)
  findOne(@Payload('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @MessagePattern(Patterns.REVIEWS.UPDATE)
  update(
    @Payload('id') id: string,
    @Payload('reviewDto') updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @MessagePattern(Patterns.REVIEWS.REMOVE)
  remove(@Payload('id') id: string) {
    return this.reviewService.remove(id);
  }
}
