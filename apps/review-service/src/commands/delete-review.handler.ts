import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteReviewCommand } from './delete-review.command';
import { ReviewRepository } from '../repositories/review.repository';

@CommandHandler(DeleteReviewCommand)
export class DeleteReviewHandler
  implements ICommandHandler<DeleteReviewCommand>
{
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(command: DeleteReviewCommand) {
    const { id } = command;
    return this.reviewRepository.delete(id);
  }
}
