import { Injectable } from '@nestjs/common';
import { CouponRepository } from '../repositories/coupon.repository';
import {
  CreateCouponDto,
  UpdateCouponDto,
  RpcNotFoundException,
  RpcBadRequestException,
} from '@app/shared';
import { Coupon } from '../entities/coupon.entity';
import { EventRepository } from '../repositories/event.repository';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly eventRepository: EventRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    await this.validateCouponApplicability(createCouponDto);
    return this.couponRepository.create(createCouponDto);
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepository.findAll({});
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new RpcNotFoundException(`Coupon with ID ${id} not found`);
    }
    return coupon;
  }

  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ code });
    if (!coupon) {
      throw new RpcNotFoundException(`Coupon with code ${code} not found`);
    }
    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    await this.validateCouponApplicability(updateCouponDto);
    const coupon = await this.couponRepository.update(id, updateCouponDto);
    if (!coupon) {
      throw new RpcNotFoundException(`Coupon with ID ${id} not found`);
    }
    return coupon;
  }

  async delete(id: string): Promise<void> {
    const result = await this.couponRepository.delete(id);
    if (!result) {
      throw new RpcNotFoundException(`Coupon with ID ${id} not found`);
    }
  }

  async incrementUsage(couponId: string): Promise<void> {
    const coupon = await this.couponRepository.findById(couponId);
    if (!coupon) {
      throw new RpcNotFoundException(`Coupon with ID ${couponId} not found`);
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      throw new RpcBadRequestException('Coupon usage limit reached');
    }
    await this.couponRepository.update(couponId, {
      usedCount: coupon.usedCount + 1,
    });
  }

  async decrementUsage(couponId: string): Promise<void> {
    const coupon = await this.couponRepository.findByIdOrFail(couponId);
    if (coupon.usedCount <= 0) {
      throw new RpcBadRequestException('Coupon usage count cannot be negative');
    }
    await this.couponRepository.update(couponId, {
      usedCount: coupon.usedCount - 1,
    });
  }

  private async validateCouponApplicability(
    dto: CreateCouponDto | UpdateCouponDto,
  ) {
    if (dto.applicableEvents) {
      for (const eventId of dto.applicableEvents) {
        await this.eventRepository.findByIdOrFail(eventId);
      }
    }
    if (dto.applicableCategories) {
      for (const categoryId of dto.applicableCategories) {
        await this.categoryRepository.findByIdOrFail(categoryId);
      }
    }
  }
}
