import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Image, Prisma, SimilarImage } from '@prisma/client';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/:clientId')
  getByClientId(
    @Param('clientId') clientId: Image['clientId'],
  ): Promise<Image[]> {
    return this.imageService.getByClientId(clientId);
  }

  @Post('/create/:clientId')
  createImage(
    @Body()
    imageDto: Omit<Prisma.ImageUncheckedCreateInput, 'clientId'>,
    @Param('clientId') clientId: string,
  ): Promise<Image> {
    const data = {
      ...imageDto,
      clientId,
    };
    return this.imageService.create(data);
  }
}
