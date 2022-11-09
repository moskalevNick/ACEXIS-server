import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateClientDto } from 'src/modules/client/dto/create-client.dto';
import { UpdateClientDto } from 'src/modules/client/dto/update-client.dto';
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

  @Post('/avatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.clientService.uploadAvatar(id, file);
  }

  @Delete('/avatar/:id')
  public async deleteAvatar(@Param('id') id: string): Promise<string> {
    return this.clientService.deleteAvatar(id);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): Promise<Client> {
    return this.clientService.remove(id);
  }
}
