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
      throw this.throwNotFound();
    }
    return entity;
  }

  findOne(filter: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findOneOrFail(filter: RootFilterQuery<T>) {
    const entity = await this.findOne(filter);
    if (!entity) {
      throw this.throwNotFound();
    }
    return entity;
  }

  update(id: string, updateDto: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async updateOrFail(id: string, updateDto: RootFilterQuery<T>): Promise<T> {
    const entity = await this.update(id, updateDto);
    if (!entity) {
      throw this.throwNotFound();
    }
    return entity;
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

  async deleteOrFail(id: string): Promise<T> {
    const entity = await this.findByIdAndDelete(id);
    if (!entity) {
      throw this.throwNotFound();
    }

    return entity;
  }

  deleteOne(filter: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }

  deleteMany(filter?: RootFilterQuery<T>): Promise<any> {
    return this.model.deleteMany(filter).exec();
  }

  findByIdAndDelete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  findOneAndDelete(filter: RootFilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }

  async findOneAndDeleteOrFail(filter: RootFilterQuery<T>): Promise<T> {
    const entity = await this.findOneAndDelete(filter);
    if (!entity) {
      throw this.throwNotFound();
    }

    return entity;
  }

  count(filter: RootFilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: RootFilterQuery<T>): Promise<boolean> {
    const count = await this.count(filter);
    return count > 0;
  }

  private throwNotFound(): RpcNotFoundException {
    return new RpcNotFoundException(`${this.model.name} not found`);
  }
}
