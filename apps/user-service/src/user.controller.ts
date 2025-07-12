import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Patterns, QueryDto, UpdateUserDto, UserType } from '@app/shared';
import { User } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(Patterns.USERS.FIND_ALL)
  findAll(@Payload() query: QueryDto): Promise<User[]> {
    return this.userService.findAll(query);
  }

  @MessagePattern(Patterns.USERS.FIND_ONE)
  async findOne(@Payload('id') id: string): Promise<UserType> {
    const user = await this.userService.findOne(id);
    return this.userService.sanitize(user);
  }

  @MessagePattern(Patterns.USERS.FIND_EMAILS_BY_IDS)
  findEmailsByIds(@Payload('ids') ids: string[]): Promise<string[]> {
    return this.userService.findEmailsByIds(ids);
  }

  @MessagePattern(Patterns.USERS.UPDATE)
  async update(
    @Payload('id') id: string,
    @Payload('userDto') userDto: UpdateUserDto,
  ): Promise<UserType> {
    const user = await this.userService.update(id, userDto);
    return this.userService.sanitize(user);
  }
}
