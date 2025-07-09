import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserDocument } from './entities/user.entity';
import { CreateUserDto, QueryDto, UpdateUserDto, UserType } from '@app/shared';
import { RpcNotFoundException } from '@app/shared';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findAll(query: QueryDto): Promise<UserDocument[]> {
    query.fields = '-password,-role';
    return this.userRepository.findAll(new QueryDto(query));
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new RpcNotFoundException('User not found');
    }
    return user;
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmail(email);
  }

  create(createDto: CreateUserDto): Promise<UserDocument> {
    return this.userRepository.create(createDto);
  }

  findEmailsByIds(ids: string[]): Promise<string[]> {
    return this.userRepository.findEmailsByIds(ids);
  }

  async update(id: string, userDto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userRepository.update(id, userDto);
    if (!user) {
      throw new RpcNotFoundException('User not found');
    }

    return user;
  }

  sanitize(user: UserDocument, excludePrefixes = ['password']): UserType {
    return plainToInstance(UserType, user.toObject(), { excludePrefixes });
  }
}
