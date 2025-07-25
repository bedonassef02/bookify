import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../entities/review.entity';
import { Repository } from '@app/shared';

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(@InjectModel(Review.name) reviewModel: Model<Review>) {
    super(reviewModel);
  }
}
