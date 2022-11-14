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
} from '@nestjs/common';
import { Client } from '@prisma/client';
import { UpdateExisDto } from './dto/update-exis.dto';
import { CreateExisDto } from 'src/modules/exis/dto/create-exis.dto';
import { ExisService } from './exis.service';

@Controller('exises')
export class ExisController {
  constructor(private readonly exisService: ExisService) {}

  @Get('/:clientId')
  getExisesByClientId(@Param('clientId') clientId: Client['id']) {
    return this.exisService.getExisesByClientId(clientId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  create() {
    return this.exisService.create(
      {
        date: new Date(),
        text: 'New Text 1',
      },
      '63727fca54802d9ddd3b68b6',
    );
  }

  // @Get('/:id')
  // getOne(@Param('id') id: string): Promise<Exis> {
  //   return this.exisService.getbyId(id);
  // }

  // @Put('/:id')
  // update(
  //   @Body() updateExisDto: UpdateExisDto,
  //   @Param('id') id: string,
  // ): Promise<Exis> {
  //   return this.exisService.update(id, updateExisDto);
  // }

  // @Delete('/:id')
  // remove(@Param('id') id: string): Promise<Exis> {
  //   return this.exisService.remove(id);
  // }
}
