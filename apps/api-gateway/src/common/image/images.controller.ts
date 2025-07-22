import { Controller, Get, Param } from '@nestjs/common';
import { CloudinaryService } from '@app/file-storage';
import { Public } from '../../users/auth/decorators/public.decorator';

@Controller({ path: 'images', version: '1' })
export class ImagesController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Public()
  @Get(':id')
  getUrl(@Param('id') id: string) {
    return this.cloudinaryService.getUrl(id);
  }
}
