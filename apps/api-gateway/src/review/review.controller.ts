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

@Controller({ path: 'reviews', version: '1' })
export class ReviewController {
  constructor(@Inject(REVIEW_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.client.send(Patterns.REVIEWS.CREATE, createReviewDto);
  }

  @Get()
  findAll() {
    return this.client.send(Patterns.REVIEWS.FIND_ALL, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send(Patterns.REVIEWS.FIND_ONE, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() reviewDto: UpdateReviewDto) {
    return this.client.send(Patterns.REVIEWS.UPDATE, { id, reviewDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send(Patterns.REVIEWS.REMOVE, id);
  }
}
