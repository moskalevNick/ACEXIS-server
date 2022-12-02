import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Client, Prisma } from '@prisma/client';
import { VisitService } from './visit.service';

@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Get('/:clientId')
  getVisitsByClientId(@Param('clientId') clientId: Client['id']) {
    return this.visitService.getVisitsByClientId(clientId);
  }

  @Post('/:clientId')
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  create(
    @Body()
    createVisitDto: Pick<Prisma.VisitUncheckedCreateInput, 'exis'>,
    @Param('clientId') clientId: Client['id'],
  ) {
    return this.visitService.create(createVisitDto, clientId);
  }
}
