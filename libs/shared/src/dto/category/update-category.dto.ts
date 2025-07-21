import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from '@app/shared/dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
