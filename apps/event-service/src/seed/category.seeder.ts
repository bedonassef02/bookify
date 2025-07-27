import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../entities/category.entity';
import { faker } from '@faker-js/faker';
import { CreateCategoryDto } from '@app/shared';

@Injectable()
export class CategorySeeder {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async seed(count: number) {
    const categories: CreateCategoryDto[] = [];
    for (let i = 0; i < count; i++) {
      categories.push(this.createCategory());
    }
    await this.categoryModel.insertMany(categories);
  }

  private createCategory(): CreateCategoryDto {
    return {
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
    };
  }
}
