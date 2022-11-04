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
import { CreateClientDto } from 'src/dto/create-client.dto';
import { UpdateClientDto } from 'src/dto/update-client.dto';
import { Client } from 'src/schemas/client.schema';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  getAll(): Promise<Client[]> {
    return this.clientService.getAll();
  }

  @Get('/:id')
  getOne(@Param('id') id: string): Promise<Client> {
    return this.clientService.getbyId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Put('/:id')
  update(
    @Body() updateClientDto: UpdateClientDto,
    @Param('id') id: string,
  ): Promise<Client> {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): Promise<Client> {
    return this.clientService.remove(id);
  }
}
