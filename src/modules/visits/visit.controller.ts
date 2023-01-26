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
import { Client, Prisma, Visit } from '@prisma/client';
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

  @Put('/:id')
  update(
    @Body()
    updateVisitDto: Pick<Prisma.VisitUpdateInput, 'exisId' | 'exis'>,
    @Param('id') id: string,
  ): Promise<Visit> {
    return this.visitService.update(id, updateVisitDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<Visit> {
    return this.visitService.delete(id);
  }
}
