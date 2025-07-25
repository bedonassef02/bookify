import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern()
  getHello(): string {
    return this.reviewService.getHello();
  }
}
