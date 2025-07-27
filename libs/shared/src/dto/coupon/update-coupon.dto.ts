import { CreateCouponDto } from '@app/shared/dto/coupon/create-coupon.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {}
