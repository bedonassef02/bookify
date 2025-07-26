import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateReviewCommand } from './create-review.command';
import { ReviewRepository } from '../repositories/review.repository';
import { EventService } from '../services/event.service';
import { RpcNotFoundException } from '@app/shared';

@CommandHandler(CreateReviewCommand)
export class CreateReviewHandler
  implements ICommandHandler<CreateReviewCommand>
{
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly eventService: EventService,
  ) {}

  async execute(command: CreateReviewCommand) {
    const { createReviewDto } = command;
    const event = await this.eventService.findOne(createReviewDto.event);
    if (!event) {
      throw new RpcNotFoundException('Event not found');
    }

    return this.reviewRepository.create(createReviewDto);
  }
}
