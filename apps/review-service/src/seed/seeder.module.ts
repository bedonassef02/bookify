import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from '../entities/review.entity';
import { ReviewSeeder } from './review.seeder';
import { CoreModule, DatabaseModule } from '@app/shared';

@Module({
  imports: [
    CoreModule.forRoot(),
    DatabaseModule.register({ dbName: 'reviewsdb' }),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  providers: [ReviewSeeder],
})
export class SeederModule {}
