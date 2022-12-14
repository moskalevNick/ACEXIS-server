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
import { Client, Prisma, Similar } from '@prisma/client';
import { SimilarService } from './similar.service';

@Controller('similar')
export class SimilarController {
  constructor(private readonly similarService: SimilarService) {}

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
  remove(@Param('id') id: string): Promise<Similar> {
    return this.similarService.remove(id);
  }
}
