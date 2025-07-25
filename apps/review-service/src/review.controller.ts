import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateReviewDto, Patterns, UpdateReviewDto } from '@app/shared';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateReviewCommand } from './commands/create-review.command';
import { FindAllReviewsQuery } from './queries/find-all-reviews.query';
import { FindOneReviewQuery } from './queries/find-one-review.query';
import { UpdateReviewCommand } from './commands/update-review.command';
import { DeleteReviewCommand } from './commands/delete-review.command';

@Controller()
export class ReviewController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(Patterns.REVIEWS.CREATE)
  create(@Payload() createReviewDto: CreateReviewDto) {
    return this.commandBus.execute(new CreateReviewCommand(createReviewDto));
  }

  @MessagePattern(Patterns.REVIEWS.FIND_ALL)
  findAll() {
    return this.queryBus.execute(new FindAllReviewsQuery());
  }

  @MessagePattern(Patterns.REVIEWS.FIND_ONE)
  findOne(@Payload('id') id: string) {
    return this.queryBus.execute(new FindOneReviewQuery(id));
  }

  @MessagePattern(Patterns.REVIEWS.UPDATE)
  update(
    @Payload('id') id: string,
    @Payload('reviewDto') updateReviewDto: UpdateReviewDto,
  ) {
    return this.commandBus.execute(
      new UpdateReviewCommand(id, updateReviewDto),
    );
  }

  @MessagePattern(Patterns.REVIEWS.REMOVE)
  remove(@Payload('id') id: string) {
    return this.commandBus.execute(new DeleteReviewCommand(id));
  }
}
