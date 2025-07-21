import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from '@app/shared/dto/event/create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  imageIds?: string[];
  featuredImageId?: string;
  category?: string;
}
