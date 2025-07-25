import { IQuery } from '@nestjs/cqrs';

export class FindOneReviewQuery implements IQuery {
  constructor(public readonly id: string) {}
}
