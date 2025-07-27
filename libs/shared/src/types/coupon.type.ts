import { DiscountType } from '../enums/discount-type.enum';

export interface CouponType {
  id: string;
  code: string;
  expiryDate?: Date;
  usedCount: number;
  usageLimit: number;
  minPurchaseAmount: number;
  applicableEvents: string[];
  applicableCategories: string[];
  discountType: DiscountType;
  value: number;
}
