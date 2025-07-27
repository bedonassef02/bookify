import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, CouponDocument } from '../entities/coupon.entity';
import { Repository } from '@app/shared';

@Injectable()
export class CouponRepository extends Repository<CouponDocument> {
  constructor(
    @InjectModel(Coupon.name)
    couponModel: Model<CouponDocument>,
  ) {
    super(couponModel);
  }
}
