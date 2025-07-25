import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateReviewCommand } from './update-review.command';
import { ReviewRepository } from '../repositories/review.repository';

@CommandHandler(UpdateReviewCommand)
export class UpdateReviewHandler
  implements ICommandHandler<UpdateReviewCommand>
{
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(command: UpdateReviewCommand) {
    const { id, updateReviewDto } = command;
    return this.reviewRepository.update(id, updateReviewDto);
  }
}
