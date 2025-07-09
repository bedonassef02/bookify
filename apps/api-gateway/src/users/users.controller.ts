import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthResponse,
  Patterns,
  QueryDto,
  Role,
  SignInDto,
  SignUpDto,
  USER_SERVICE,
  UserType,
} from '@app/shared';
import { Observable } from 'rxjs';
import { Public } from './auth/decorators/public.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { Roles } from './auth/decorators/roles.decorator';
import { ChangePasswordDto } from '@app/shared/dto/user/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Observable<AuthResponse> {
    return this.client.send(Patterns.USERS.SIGN_UP, signUpDto);
  }

  @Public()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Observable<AuthResponse> {
    return this.client.send(Patterns.USERS.SIGN_IN, signInDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query: QueryDto): Observable<UserType[]> {
    return this.client.send(Patterns.USERS.FIND_ALL, query);
  }

  @Get('me')
  me(@CurrentUser('userId') id: string): Observable<UserType> {
    return this.client.send(Patterns.USERS.FIND_ONE, { id });
  }

  @Put('change-password')
  changePassword(
    @CurrentUser('userId') id: string,
    @Body() passwordDto: ChangePasswordDto,
  ): Observable<UserType> {
    return this.client.send(Patterns.USERS.CHANGE_PASSWORD, {
      id,
      passwordDto,
    });
  }
}
