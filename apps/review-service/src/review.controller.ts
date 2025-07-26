import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateReviewDto, Patterns, UpdateReviewDto } from '@app/shared';
import { ReviewService } from './review.service';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern(Patterns.REVIEWS.CREATE)
  create(@Payload() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @MessagePattern(Patterns.REVIEWS.FIND_ALL)
  findAll(@Payload('event') event: string) {
    return this.reviewService.findAll(event);
  }

  @MessagePattern(Patterns.REVIEWS.UPDATE)
  update(
    @Payload('id') id: string,
    @Payload('user') user: string,
    @Payload('event') event: string,
    @Payload('reviewDto') updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, user, event, updateReviewDto);
  }

  @MessagePattern(Patterns.REVIEWS.REMOVE)
  remove(
    @Payload('id') id: string,
    @Payload('user') user: string,
    @Payload('event') event: string,
  ) {
    return this.reviewService.remove(id, user, event);
  }
}
