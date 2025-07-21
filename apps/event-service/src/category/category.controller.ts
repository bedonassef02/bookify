import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCategoryDto, Patterns, UpdateCategoryDto } from '@app/shared';
import { CategoryService } from './category.service';
import { Category } from '../entities/category.entity';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern(Patterns.CATEGORIES.CREATE)
  create(@Payload() categoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(categoryDto);
  }

  @MessagePattern(Patterns.CATEGORIES.FIND_ALL)
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @MessagePattern(Patterns.CATEGORIES.FIND_ONE)
  findOne(@Payload('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @MessagePattern(Patterns.CATEGORIES.UPDATE)
  update(
    @Payload('id') id: string,
    @Payload('categoryDto') categoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, categoryDto);
  }

  @MessagePattern(Patterns.CATEGORIES.REMOVE)
  remove(@Payload('id') id: string): Promise<Category> {
    return this.categoryService.remove(id);
  }
}
