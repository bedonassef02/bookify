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

  async applyCoupon(
    bookDto: BookDto,
    totalPrice: number,
    event: EventType,
  ): Promise<ProcessCoupon> {
    const coupon: CouponType = await this.findCoupon(
      bookDto.couponCode as string,
    );

    this.validate(coupon, totalPrice);
    this.isApplicable(bookDto, event, coupon);
    await this.incrementCouponUsage(coupon.id);

    return {
      couponCode: coupon.code,
      discountAmount: this.getDiscountAmount(coupon, totalPrice),
    };
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

  private getDiscountAmount(coupon: CouponType, totalPrice: number) {
    let discountAmount = 0;
    if (coupon.discountType === DiscountType.FIXED) {
      discountAmount = coupon.value;
    } else {
      discountAmount = (totalPrice * coupon.value) / 100;
    }

    if (totalPrice - discountAmount < 0) {
      discountAmount = totalPrice;
    }

    return discountAmount;
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

  private validate(coupon: CouponType, totalPrice: number): void {
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      throw new RpcBadRequestException('Coupon has expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new RpcBadRequestException('Coupon usage limit reached');
    }

    if (coupon.minPurchaseAmount > totalPrice) {
      throw new RpcBadRequestException(
        `Minimum purchase amount of ${coupon.minPurchaseAmount} not met for this coupon`,
      );
    }
  }
}
