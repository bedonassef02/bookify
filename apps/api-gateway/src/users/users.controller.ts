import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService, createParseFilePipe } from '@app/file-storage';
import {
  Patterns,
  QueryDto,
  Role,
  UpdateProfileDto,
  USER_SERVICE,
  UserType,
} from '@app/shared';
import { Observable } from 'rxjs';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { Roles } from './auth/decorators/roles.decorator';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private cloudinaryService: CloudinaryService,
    @Inject(USER_SERVICE) private client: ClientProxy,
  ) {}

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query: QueryDto): Observable<UserType[]> {
    return this.client.send(Patterns.USERS.FIND_ALL, query);
  }

  @Get('me')
  me(@CurrentUser('userId') id: string): Observable<UserType> {
    return this.client.send(Patterns.USERS.FIND_ONE, { id });
  }

  @Patch('me')
  update(
    @CurrentUser('userId') id: string,
    @Body() userDto: UpdateProfileDto,
  ): Observable<UserType> {
    return this.client.send(Patterns.USERS.UPDATE, { id, userDto });
  }

  @Patch('deactivate')
  deactivate(@CurrentUser('userId') id: string): Observable<UserType> {
    return this.client.send(Patterns.USERS.UPDATE, {
      id,
      userDto: { isActive: false },
    });
  }

  @Roles(Role.ADMIN)
  @Patch('reactivate/:id')
  reactivate(@Param('id') id: string): Observable<UserType> {
    return this.client.send(Patterns.USERS.UPDATE, {
      id,
      userDto: { isActive: true },
    });
  }

  @Patch('profile-picture')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfilePicture(
    @CurrentUser('userId') id: string,
    @UploadedFile(createParseFilePipe('2MB', ['png', 'jpeg']))
    file: Express.Multer.File,
  ): Promise<Observable<UserType>> {
    const profilePicture = await this.cloudinaryService.uploadFile(file);

    return this.client.send(Patterns.USERS.UPDATE, {
      id,
      userDto: { profilePicture },
    });
  }
}
