import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { HashingService } from '../hashing/hashing.service';
import { UserDocument } from '../entities/user.entity';
import { SignUpDto } from '@app/shared';
import { RpcConflictException } from '@app/shared';
import { SignInDto } from '@app/shared/dto/user/sign-in.dto';
import { RpcUnauthorizedException } from '@app/shared';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly hashingService: HashingService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<UserDocument> {
    const user: UserDocument | null = await this.usersService.findByEmail(
      signInDto.email,
    );

    if (!user) {
      throw new RpcUnauthorizedException('email or password is incorrect');
    }

    if (!(await this.isSamePassword(signInDto.password, user.password))) {
      throw new RpcUnauthorizedException('email or password is incorrect');
    }

    return user;
  }

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

  private async isSamePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return this.hashingService.compare(password, userPassword);
  }
}
