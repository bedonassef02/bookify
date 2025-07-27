import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  EVENT_SERVICE,
  Patterns,
  RpcBadRequestException,
  DiscountType,
  BookDto,
  EventType,
  CouponType,
} from '@app/shared';
import { ProcessCoupon } from '../interfaces/process-coupon.interface';

@Injectable()
export class CouponService {
  constructor(@Inject(EVENT_SERVICE) private eventClient: ClientProxy) {}

  async findCoupon(couponCode: string): Promise<CouponType> {
    return firstValueFrom<CouponType>(
      this.eventClient.send(Patterns.COUPONS.FIND_BY_CODE, couponCode),
    );
  }

  validateCoupon(coupon: CouponType): void {
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      throw new RpcBadRequestException('Coupon has expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new RpcBadRequestException('Coupon usage limit reached');
    }
  }

  async applyCoupon(
    bookDto: BookDto,
    totalPrice: number,
    event: EventType,
  ): Promise<ProcessCoupon> {
    let discountAmount = 0;
    let couponCode: string | null = null;

    const coupon: CouponType = await this.findCoupon(
      bookDto.couponCode as string,
    );
    if (!coupon) {
      throw new RpcBadRequestException('Invalid coupon code');
    }
    this.validateCoupon(coupon);

    if (coupon.minPurchaseAmount > totalPrice) {
      throw new RpcBadRequestException(
        `Minimum purchase amount of ${coupon.minPurchaseAmount} not met for this coupon`,
      );
    }

    this.isApplicable(bookDto, event, coupon);

    if (coupon.discountType === DiscountType.FIXED) {
      discountAmount = coupon.value;
    } else {
      discountAmount = (totalPrice * coupon.value) / 100;
    }

    if (totalPrice - discountAmount < 0) {
      discountAmount = totalPrice;
    }
    couponCode = coupon.code;

    return { discountAmount, couponCode, coupon };
  }

  async incrementCouponUsage(couponId: string): Promise<void> {
    await firstValueFrom(
      this.eventClient.send(Patterns.COUPONS.INCREMENT_USAGE, {
        id: couponId,
      }),
    );
  }

  async decrementCouponUsage(couponId: string): Promise<void> {
    await firstValueFrom(
      this.eventClient.send(Patterns.COUPONS.DECREMENT_USAGE, {
        id: couponId,
      }),
    );
  }

  private isApplicable(
    bookDto: BookDto,
    event: EventType,
    coupon: CouponType,
  ): void {
    const isApplicableToEvent = coupon.applicableEvents.includes(bookDto.event);
    const isApplicableToCategory = coupon.applicableCategories.includes(
      event.category,
    );

    if (!isApplicableToEvent && !isApplicableToCategory) {
      throw new RpcBadRequestException(
        'Coupon is not applicable to this event or category',
      );
    }
  }
}
