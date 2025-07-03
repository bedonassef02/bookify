import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserDocument } from './entities/user.entity';
import { CreateUserDto } from '@app/shared';
import { RpcNotFoundException } from '@app/shared';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);
    if (user) {
      return user;
    }

    throw new RpcNotFoundException('User not found');
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmail(email);
  }

  create(createDto: CreateUserDto): Promise<UserDocument> {
    return this.userRepository.create(createDto);
  }

  async findEmailsByIds(ids: string[]): Promise<string[]> {
    return this.userRepository.findEmailsByIds(ids);
  }
}
