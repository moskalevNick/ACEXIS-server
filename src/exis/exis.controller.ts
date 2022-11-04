import { UpdateExisDto } from './../dto/update-exis.dto';
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
import { CreateExisDto } from 'src/dto/create-exis.dto';
import { Exis } from 'src/schemas/exis.schema';
import { ExisService } from './exis.service';

@Controller('exis')
export class ExisController {
  constructor(private readonly exisService: ExisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  create(@Body() createExisDto: CreateExisDto) {
    return this.exisService.create(createExisDto);
  }

  @Get('/:id')
  getOne(@Param('id') id: string): Promise<Exis> {
    return this.exisService.getbyId(id);
  }

  @Put('/:id')
  update(
    @Body() updateExisDto: UpdateExisDto,
    @Param('id') id: string,
  ): Promise<Exis> {
    return this.exisService.update(id, updateExisDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): Promise<Exis> {
    return this.exisService.remove(id);
  }
}
