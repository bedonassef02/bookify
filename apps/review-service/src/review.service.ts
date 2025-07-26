import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './repositories/review.repository';
import {
  CreateReviewDto,
  UpdateReviewDto,
  RpcNotFoundException,
} from '@app/shared';
import { EventService } from './services/event.service';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly eventService: EventService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const event = await this.eventService.findOne(createReviewDto.event);
    if (!event) {
      throw new RpcNotFoundException('Event not found');
    }
    return this.reviewRepository.create(createReviewDto);
  }

  async findAll(event: string): Promise<Review[]> {
    return this.reviewRepository.findAll({ event });
  }

  async update(
    id: string,
    user: string,
    event: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const result = await this.reviewRepository.findOneAndUpdate(
      { id, user, event },
      updateReviewDto,
    );
    if (!result) {
      throw new RpcNotFoundException('Review not found');
    }
    return result;
  }

  async remove(id: string, user: string, event: string): Promise<Review> {
    const result = await this.reviewRepository.findOneAndDelete({
      id,
      user,
      event,
    });
    if (!result) {
      throw new RpcNotFoundException('Review not found or unauthorized');
    }
    return result;
  }
}
