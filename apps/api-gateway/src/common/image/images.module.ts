import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { CloudinaryModule } from '@app/file-storage';

@Module({
  imports: [CloudinaryModule],
  controllers: [ImagesController],
  exports: [ImagesController],
})
export class ImagesModule {}
