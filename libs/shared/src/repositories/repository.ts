import { Model, Document, RootFilterQuery } from 'mongoose';
import { IRepository } from '../interfaces';
import { QueryDto } from '@app/shared';

export abstract class Repository<T extends Document> implements IRepository<T> {
  protected constructor(protected readonly model: Model<T>) {}

  create(createDto: any): Promise<T> {
    return this.model.create(createDto);
  }

  async findAll(query?: QueryDto): Promise<T[]> {
    if (!query) return this.model.find();

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

  update(id: string, updateDto: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  deleteMany(filter?: RootFilterQuery<T>): Promise<any> {
    return this.model.deleteMany(filter).exec();
  }
}
