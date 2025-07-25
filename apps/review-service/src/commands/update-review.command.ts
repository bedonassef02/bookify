import { ICommand } from '@nestjs/cqrs';
import { UpdateReviewDto } from '@app/shared';

export class UpdateReviewCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly updateReviewDto: UpdateReviewDto,
  ) {}
}
