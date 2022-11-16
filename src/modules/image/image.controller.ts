import { Controller, Get, Param } from '@nestjs/common';
import { Image } from '@prisma/client';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/:clientId')
  getByClientId(
    @Param('clientId') clientId: Image['clientId'],
  ): Promise<Image[]> {
    return this.imageService.getByClientId(clientId);
  }
}
