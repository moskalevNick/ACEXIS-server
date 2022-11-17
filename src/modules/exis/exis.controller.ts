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
import { Client, Prisma, Exis } from '@prisma/client';
import { ExisService } from './exis.service';

@Controller('exises')
export class ExisController {
  constructor(private readonly exisService: ExisService) {}

  @Get('/:clientId')
  getExisesByClientId(@Param('clientId') clientId: Client['id']) {
    return this.exisService.getExisesByClientId(clientId);
  }

  @Post('/:clientId')
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  create(
    @Body()
    createExisDto: Pick<Prisma.ExisCreateInput, 'text'>,
    @Param('clientId') clientId: Client['id'],
  ) {
    return this.exisService.create(createExisDto, clientId);
  }

  @Put('/:id')
  update(
    @Body() updateExisDto: Pick<Prisma.ExisUpdateInput, 'text'>,
    @Param('id') id: Exis['id'],
  ): Promise<Exis> {
    return this.exisService.update(id, updateExisDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: Exis['id']): Promise<Exis> {
    return this.exisService.delete(id);
  }
}
