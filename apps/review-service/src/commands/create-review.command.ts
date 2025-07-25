import { ICommand } from '@nestjs/cqrs';
import { CreateReviewDto } from '@app/shared';

export class CreateReviewCommand implements ICommand {
  constructor(public readonly createReviewDto: CreateReviewDto) {}
}
