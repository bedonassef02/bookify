import { OmitType } from '@nestjs/mapped-types';
import { CreateReviewDto } from '@app/shared';

export class UpdateReviewDto extends OmitType(CreateReviewDto, ['event']) {}
