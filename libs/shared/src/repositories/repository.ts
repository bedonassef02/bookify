import { Model, Document, RootFilterQuery } from 'mongoose';
import { IRepository } from '../interfaces';
import { QueryDto, RpcNotFoundException } from '@app/shared';

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

  async findByIdOrFail(id: string) {
    const entity = await this.findById(id);
    if (!entity) {
      throw new RpcNotFoundException(`${this.model.name} not found`);
    }
    return entity;
  }

  findOne(filter: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findOneOrFail(filter: RootFilterQuery<T>) {
    const entity = await this.findOne(filter);
    if (!entity) {
      throw new RpcNotFoundException(`${this.model.name} not found`);
    }
    return entity;
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

  deleteOne(filter: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }

  deleteMany(filter?: RootFilterQuery<T>): Promise<any> {
    return this.model.deleteMany(filter).exec();
  }

  findOneAndDelete(filter: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }
}
