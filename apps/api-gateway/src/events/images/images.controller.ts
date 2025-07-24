import {
  Controller,
  Inject,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  CloudinaryService,
  createParseFilePipe,
  MaxFileCount,
} from '@app/file-storage';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';
import { EVENT_SERVICE, Patterns, Role } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from '../../users/auth/decorators/roles.decorator';

@Controller({ path: 'events/:id/images', version: '1' })
export class ImagesController {
  constructor(
    private cloudinaryService: CloudinaryService,
    @Inject(EVENT_SERVICE) private client: ClientProxy,
  ) {}

  @Roles(Role.ADMIN)
  @Post('feature-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @Param('id', ParseMongoIdPipe) id: string,
    @UploadedFile(createParseFilePipe('2MB', ['png', 'jpeg']))
    file: Express.Multer.File,
  ) {
    const featuredImageId = await this.cloudinaryService.uploadFile(file);

    return this.client.send(Patterns.EVENTS.UPDATE, {
      id,
      eventDto: { featuredImageId },
    });
  }

  @Roles(Role.ADMIN)
  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', MaxFileCount.EVENT_IMAGES))
  async uploadFiles(
    @Param('id', ParseMongoIdPipe) id: string,
    @UploadedFiles(createParseFilePipe('2MB', ['png', 'jpeg']))
    files: Express.Multer.File[],
  ) {
    const imageIds = await this.cloudinaryService.uploadFiles(files);

    return this.client.send(Patterns.EVENTS.UPDATE, {
      id,
      eventDto: { imageIds },
    });
  }
}
