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

  findOne(id: string): Promise<Coupon> {
    return this.couponRepository.findByIdOrFail(id);
  }

  findByCode(code: string): Promise<Coupon> {
    return this.couponRepository.findOneOrFail({ code });
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
    await this.couponRepository.deleteOrFail(id);
  }

  async incrementUsage(couponId: string): Promise<void> {
    const coupon = await this.couponRepository.findByIdOrFail(couponId);
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
