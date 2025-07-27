import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto, Patterns } from '@app/shared';
import { Coupon } from '../entities/coupon.entity';

@Controller()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @MessagePattern(Patterns.COUPONS.CREATE)
  async create(@Payload() createCouponDto: CreateCouponDto): Promise<Coupon> {
    return this.couponService.create(createCouponDto);
  }

  @MessagePattern(Patterns.COUPONS.FIND_ALL)
  async findAll(): Promise<Coupon[]> {
    return this.couponService.findAll();
  }

  @MessagePattern(Patterns.COUPONS.FIND_ONE)
  async findOne(@Payload('id') id: string): Promise<Coupon> {
    return this.couponService.findOne(id);
  }

  @MessagePattern(Patterns.COUPONS.FIND_BY_CODE)
  async findByCode(@Payload('code') code: string): Promise<Coupon> {
    return this.couponService.findByCode(code);
  }

  @MessagePattern(Patterns.COUPONS.UPDATE)
  async update(
    @Payload('id') id: string,
    @Payload('updateCouponDto') updateCouponDto: UpdateCouponDto,
  ): Promise<Coupon> {
    return this.couponService.update(id, updateCouponDto);
  }

  @MessagePattern(Patterns.COUPONS.DELETE)
  async delete(@Payload('id') id: string): Promise<void> {
    return this.couponService.delete(id);
  }

  @MessagePattern(Patterns.COUPONS.INCREMENT_USAGE)
  async incrementUsage(@Payload('id') id: string): Promise<void> {
    return this.couponService.incrementUsage(id);
  }

  @MessagePattern(Patterns.COUPONS.DECREMENT_USAGE)
  async decrementUsage(@Payload('id') id: string): Promise<void> {
    return this.couponService.decrementUsage(id);
  }
}
