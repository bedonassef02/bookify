import { Module } from '@nestjs/common';
import { CoreModule, DatabaseModule } from '@app/shared';
import { ReviewService } from './review.service';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './entities/review.entity';

@Module({
  imports: [
    CoreModule,
    DatabaseModule.register({ dbName: 'reviewsdb' }),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  providers: [ReviewService, ReviewRepository],
  controllers: [ReviewController],
})
export class AppModule {}
