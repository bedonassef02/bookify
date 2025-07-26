import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import {
  CreateReviewDto,
  Patterns,
  REVIEW_SERVICE,
  UpdateReviewDto,
} from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUser } from '../users/auth/decorators/current-user.decorator';
import { Public } from '../users/auth/decorators/public.decorator';

@Controller({ path: 'events/:eventId/reviews', version: '1' })
export class ReviewController {
  constructor(@Inject(REVIEW_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(
    @CurrentUser('userId') user: string,
    @Param('eventId') event: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    createReviewDto.user = user;
    createReviewDto.event = event;
    return this.client.send(Patterns.REVIEWS.CREATE, createReviewDto);
  }

  @Get()
  @Public()
  findAll(@Param('eventId') event: string) {
    return this.client.send(Patterns.REVIEWS.FIND_ALL, { event });
  }

  @Patch(':id')
  update(
    @CurrentUser('userId') user: string,
    @Param('eventId') event: string,
    @Param('id') id: string,
    @Body() reviewDto: UpdateReviewDto,
  ) {
    return this.client.send(Patterns.REVIEWS.UPDATE, {
      id,
      user,
      event,
      reviewDto,
    });
  }

  @Delete(':id')
  remove(
    @CurrentUser('userId') user: string,
    @Param('eventId') event: string,
    @Param('id') id: string,
  ) {
    return this.client.send(Patterns.REVIEWS.REMOVE, { id, user, event });
  }
}
