import { Body, Controller, Get, Inject, Patch, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  Patterns,
  QueryDto,
  Role,
  UpdateProfileDto,
  USER_SERVICE,
  UserType,
} from '@app/shared';
import { Observable } from 'rxjs';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { Roles } from './auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query: QueryDto): Observable<UserType[]> {
    return this.client.send(Patterns.USERS.FIND_ALL, query);
  }

  @Get('me')
  me(@CurrentUser('userId') id: string): Observable<UserType> {
    return this.client.send(Patterns.USERS.FIND_ONE, { id });
  }

  @Patch('me')
  update(
    @CurrentUser('userId') id: string,
    @Body() userDto: UpdateProfileDto,
  ): Observable<UserType> {
    return this.client.send(Patterns.USERS.UPDATE, { id, userDto });
  }
}
