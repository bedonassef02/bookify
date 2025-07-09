import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserDocument } from './entities/user.entity';
import { CreateUserDto, QueryDto, UserType } from '@app/shared';
import { RpcNotFoundException } from '@app/shared';
import { plainToInstance } from 'class-transformer';
import { ChangePasswordDto } from '@app/shared/dto/user/change-password.dto';
import { PasswordService } from './services/password.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  findAll(query: QueryDto): Promise<UserDocument[]> {
    query.fields = '-password,-role';
    return this.userRepository.findAll(new QueryDto(query));
  }

  async findOne(id: string): Promise<UserType> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new RpcNotFoundException('User not found');
    }

    return plainToInstance(UserType, user.toObject(), {
      excludePrefixes: ['password', 'role'],
    });
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

  async changePassword(
    id: string,
    passwordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new RpcNotFoundException('User not found');

    await this.passwordService.verify(
      passwordDto.currentPassword,
      user.password,
    );

    this.passwordService.ensureDifferent(passwordDto);

    const password = await this.passwordService.hash(passwordDto.newPassword);
    await this.userRepository.update(id, { password });

    return true;
  }
}
