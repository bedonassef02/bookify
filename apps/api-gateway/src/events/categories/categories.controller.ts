import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateCategoryDto,
  EVENT_SERVICE,
  Patterns,
  Role,
  UpdateCategoryDto,
} from '@app/shared';
import { Observable } from 'rxjs';
import { Public } from '../../users/auth/decorators/public.decorator';
import { Roles } from '../../users/auth/decorators/roles.decorator';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

@Controller('categories')
export class CategoriesController {
  constructor(@Inject(EVENT_SERVICE) private client: ClientProxy) {}

  @Public()
  @Get()
  findAll(): Observable<any> {
    return this.client.send(Patterns.CATEGORIES.FIND_ALL, {});
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string): Observable<any> {
    return this.client.send(Patterns.CATEGORIES.FIND_ONE, { id });
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() categoryDto: CreateCategoryDto): Observable<any> {
    return this.client.send(Patterns.CATEGORIES.CREATE, categoryDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() categoryDto: UpdateCategoryDto,
  ): Observable<any> {
    return this.client.send(Patterns.CATEGORIES.UPDATE, { id, categoryDto });
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseMongoIdPipe) id: string): Observable<any> {
    return this.client.send(Patterns.CATEGORIES.REMOVE, { id });
  }
}
