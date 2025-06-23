import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { HashingService } from '../hashing/hashing.service';
import { UserDocument } from '../entities/user.entity';
import { SignUpDto } from '@app/shared';
import { RpcConflictException } from '@app/shared';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly hashingService: HashingService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UserDocument> {
    const user: UserDocument | null = await this.usersService.findByEmail(
      signUpDto.email,
    );

    if (user) {
      throw new RpcConflictException('User already exists');
    }
    signUpDto.password = await this.hashingService.hash(signUpDto.password);

    return this.usersService.create(signUpDto);
  }
}
