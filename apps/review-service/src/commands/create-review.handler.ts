import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateReviewCommand } from './create-review.command';
import { ReviewRepository } from '../repositories/review.repository';

@CommandHandler(CreateReviewCommand)
export class CreateReviewHandler
  implements ICommandHandler<CreateReviewCommand>
{
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(command: CreateReviewCommand) {
    const { createReviewDto } = command;
    return this.reviewRepository.create(createReviewDto);
  }
}
