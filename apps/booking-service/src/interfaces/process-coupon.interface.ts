import { CouponType } from '@app/shared';

export interface ProcessCoupon {
  discountAmount: number;
  couponCode: string;
  coupon: CouponType;
}
