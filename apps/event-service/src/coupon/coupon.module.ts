import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { Coupon, CouponSchema } from '../entities/coupon.entity';
import { CouponRepository } from '../repositories/coupon.repository';
import { EventRepository } from '../repositories/event.repository';
import { CategoryRepository } from '../repositories/category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
  ],
  providers: [
    CouponService,
    CouponRepository,
    EventRepository,
    CategoryRepository,
  ],
  controllers: [CouponController],
  exports: [CouponService],
})
export class CouponModule {}
