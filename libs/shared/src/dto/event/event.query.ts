import { QueryDto } from '../query.dto';
import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { EventStatus } from '@app/shared/enums';
import { RootFilterQuery } from 'mongoose';

export class EventQuery extends QueryDto {
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  get filter(): RootFilterQuery<any> {
    const filter: RootFilterQuery<any> = {};

    if (this.category) {
      filter.category = this.category;
    }

    if (this.status) {
      filter.status = this.status;
    }

    if (this.keyword) {
      filter.$or = [
        { title: { $regex: this.keyword, $options: 'i' } },
        { description: { $regex: this.keyword, $options: 'i' } },
        { location: { $regex: this.keyword, $options: 'i' } },
      ];
    }

    if (this.startDate || this.endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (this.startDate) {
        dateFilter.$gte = new Date(this.startDate);
      }
      if (this.endDate) {
        dateFilter.$lte = new Date(this.endDate);
      }
      filter.date = dateFilter;
    }

    return filter;
  }

  constructor(query?: Partial<EventQuery>) {
    super(query);
    if (!query) return;

    Object.assign(this, query);
  }
}
