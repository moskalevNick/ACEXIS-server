import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Client, Prisma, Similar, SimilarImage } from '@prisma/client';
import { ImageService } from '../image/image.service';
import { SimilarService } from './similar.service';

@Controller('similar')
export class SimilarController {
  constructor(
    private readonly similarService: SimilarService,
    private readonly imageService: ImageService,
  ) {}

  @Get('/:clientId')
  getSimilarsByClientId(
    @Param('clientId') clientId: Client['id'],
  ): Promise<Similar[]> {
    return this.similarService.getSimilarsByClientId(clientId);
  }

  @Post('/:clientId')
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  create(
    @Body()
    createSimilarDto: Prisma.SimilarUncheckedCreateInput,
    @Param('clientId') clientId: Client['id'],
  ): Promise<Similar> {
    return this.similarService.create(createSimilarDto, clientId);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<Similar> {
    return this.similarService.delete(id);
  }

  @Delete('image/:id') public async deleteImage(
    @Param('id') id: string,
  ): Promise<SimilarImage> {
    return this.imageService.deleteSimilarImage(id);
  }
}
