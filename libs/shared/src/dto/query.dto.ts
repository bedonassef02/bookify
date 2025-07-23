import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { RootFilterQuery } from 'mongoose';

export abstract class QueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  fields: string = '-__v';

  @IsOptional()
  @IsString()
  sort: string = 'createdAt';

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  get select(): string {
    return this.fields.replace(',', ' ');
  }

  get order(): string {
    return this.sort.replace(',', ' ');
  }

  protected constructor(query?: Partial<QueryDto>) {
    if (!query) return;

    Object.assign(this, query);
  }

  abstract get filter(): RootFilterQuery<any>;
}
