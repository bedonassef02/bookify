import { Model, Document } from 'mongoose';
import { IRepository } from '../interfaces';
import { QueryDto } from '@app/shared';

export abstract class Repository<T extends Document> implements IRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(createDto: any): Promise<T> {
    const created = new this.model(createDto);
    return created.save();
  }

  async findAll(query?: QueryDto): Promise<T[]> {
    if (!query) return this.model.find();

    return this.model
      .find() // @todo: add filter
      .limit(query.limit)
      .skip(query.skip)
      .select(query.select)
      .sort(query.order)
      .exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, updateDto: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
