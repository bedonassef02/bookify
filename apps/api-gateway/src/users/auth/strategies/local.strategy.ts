import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ClientProxy } from '@nestjs/microservices';
import { Patterns, USER_SERVICE } from '@app/shared';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await lastValueFrom(
      this.client.send(Patterns.AUTH.SIGN_IN, { email, password }),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
