import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from '@app/shared';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
