import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import {
  CreateUserDto,
  QueryDto,
  UpdateUserDto,
  UserType,
  RpcNotFoundException,
} from '@app/shared';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findAll(query: QueryDto): Promise<User[]> {
    query.fields = '-password,-role';
    return this.userRepository.findAll(new QueryDto(query));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new RpcNotFoundException('User not found');
    }
    return user;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  create(createDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createDto);
  }

  findEmailsByIds(ids: string[]): Promise<string[]> {
    return this.userRepository.findEmailsByIds(ids);
  }

  async update(id: string, userDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.update(id, userDto);
    if (!user) {
      throw new RpcNotFoundException('User not found');
    }

    return user;
  }

  sanitize(
    user: User,
    excludePrefixes = ['password', 'credentials'],
  ): UserType {
    return plainToInstance(UserType, user.toObject(), { excludePrefixes });
  }
}
