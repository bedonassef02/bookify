import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryDto {
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

  constructor(query?: Partial<QueryDto>) {
    if (!query) return;

    Object.assign(this, query);
  }
}
