import { Controller, Get, Param } from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from 'src/modules/image/image.schema';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/:clientId')
  getOne(@Param('clientId') clientId: string): Promise<Image[]> {
    return this.imageService.getByClientId(clientId);
  }
}
