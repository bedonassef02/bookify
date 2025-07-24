import { Model, Document, RootFilterQuery } from 'mongoose';
import { IRepository } from '../interfaces';
import { QueryDto } from '@app/shared';

export abstract class Repository<T extends Document> implements IRepository<T> {
  protected constructor(protected readonly model: Model<T>) {}

  create(createDto: any): Promise<T> {
    return this.model.create(createDto);
  }

  async findAll(query?: QueryDto | RootFilterQuery<T>): Promise<T[]> {
    if (!query) return this.model.find();
    if (!(query instanceof QueryDto)) {
      return this.model.find(query).exec();
    }

    return this.model
      .find(query.filter)
      .limit(query.limit)
      .skip(query.skip)
      .select(query.select)
      .sort(query.order)
      .exec();
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  findOne(filter: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  update(id: string, updateDto: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  findOneAndUpdate(
    filter: RootFilterQuery<T>,
    updateDto: RootFilterQuery<T>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, updateDto, { new: true }).exec();
  }

  delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  deleteMany(filter?: RootFilterQuery<T>): Promise<any> {
    return this.model.deleteMany(filter).exec();
  }

  findOneAndDelete(filter: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }
}
