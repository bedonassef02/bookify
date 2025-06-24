import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { HashingService } from '../hashing/hashing.service';
import { UserDocument } from '../entities/user.entity';
import { AuthResponse, SignUpDto } from '@app/shared';
import { RpcConflictException, RpcUnauthorizedException } from '@app/shared';
import { SignInDto } from '@app/shared/dto/user/sign-in.dto';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const user = await this.validateUser(signInDto.email, signInDto.password);

    if (!user) {
      throw new RpcUnauthorizedException('Invalid credentials');
    }

    const tokens = await this.tokenService.generate(user);
    return {
      user,
      tokens,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);

    if (existingUser) {
      throw new RpcConflictException('User already exists');
    }

    const hashedPassword = await this.hashingService.hash(signUpDto.password);
    const newUser = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });

    const sanitizedUser = this.sanitizeUser(newUser);
    const tokens = await this.tokenService.generate(sanitizedUser);

    return {
      user: sanitizedUser,
      tokens,
    };
  }

  private sanitizeUser(user: UserDocument): Partial<UserDocument> {
    const { password, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }
}
