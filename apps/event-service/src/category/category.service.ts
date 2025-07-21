import { Injectable } from '@nestjs/common';
import {
  CreateCategoryDto,
  RpcNotFoundException,
  UpdateCategoryDto,
} from '@app/shared';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(categoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(categoryDto);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new RpcNotFoundException(`Category With ${id} not found`);
    }
    return category;
  }

  async update(id: string, categoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.update(id, categoryDto);
    if (!category) {
      throw new RpcNotFoundException(`Category With ${id} not found`);
    }

    return category;
  }

  async remove(id: string): Promise<Category> {
    const category = await this.categoryRepository.delete(id);
    if (!category) {
      throw new RpcNotFoundException(`Category With ${id} not found`);
    }

    return category;
  }
}
