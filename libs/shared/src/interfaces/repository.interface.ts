import { QueryDto } from '@app/shared';
import { RootFilterQuery } from 'mongoose';

export interface IRepository<T> {
  create(createDto: any): Promise<T>;
  findAll(query?: QueryDto | RootFilterQuery<T>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findByIdOrFail(id: string): Promise<T>;
  findOne(filter: RootFilterQuery<T>): Promise<T | null>;
  findOneOrFail(filter: RootFilterQuery<T>): Promise<T>;
  update(id: string, updateDto: RootFilterQuery<T>): Promise<T | null>;
  findOneAndUpdate(
    filter: RootFilterQuery<T>,
    updateDto: RootFilterQuery<T>,
  ): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  deleteOrFail(id: string): Promise<T>;
  deleteOne(filter: RootFilterQuery<T>): Promise<T | null>;
  deleteMany(filter?: RootFilterQuery<T>): Promise<any>;
  findByIdAndDelete(id: string): Promise<T | null>;
  findOneAndDelete(filter: RootFilterQuery<T>): Promise<T | null>;
  findOneAndDeleteOrFail(filter: RootFilterQuery<T>): Promise<T>;
  count(filter: RootFilterQuery<T>): Promise<number>;
  exists(filter: RootFilterQuery<T>): Promise<boolean>;
}
