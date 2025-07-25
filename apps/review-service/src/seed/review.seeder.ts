import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../entities/review.entity';
import { faker } from '@faker-js/faker';
import { CreateReviewDto } from '@app/shared';

@Injectable()
export class ReviewSeeder {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async seed(): Promise<void> {
    await this.reviewModel.deleteMany({});

    const reviews: CreateReviewDto[] = [];
    for (let i = 0; i < 10; i++) {
      reviews.push({
        userId: faker.database.mongodbObjectId(),
        eventId: faker.database.mongodbObjectId(),
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
      });
    }

    await this.reviewModel.insertMany(reviews);
    console.log(`Seeded ${reviews.length} reviews.`);
  }
}
