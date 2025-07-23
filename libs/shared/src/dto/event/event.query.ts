import { QueryDto } from '../query.dto';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { EventStatus } from '@app/shared/enums';

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

  get filter(): any {
    return {
      category: this.category,
      status: this.status,
    };
  }

  get search(): any {
    return {
      $or: [
        { title: { $regex: this.keyword, $options: 'i' } },
        { description: { $regex: this.keyword, $options: 'i' } },
        { location: { $regex: this.keyword, $options: 'i' } },
      ],
    };
  }

  constructor(query?: Partial<EventQuery>) {
    super(query);
    if (!query) return;

    Object.assign(this, query);
  }
}
