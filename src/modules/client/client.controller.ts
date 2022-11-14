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
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateClientDto } from 'src/modules/client/dto/create-client.dto';
import { UpdateClientDto } from 'src/modules/client/dto/update-client.dto';
import { Client } from 'src/modules/client/client.schema';
import { ClientService } from './client.service';
import { AccessTokenGuard } from 'src/commons/guards/accessToken.guard';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getAll(@Req() req): Promise<Client[]> {
    return this.clientService.getClientsByUserId(req.user.userId);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Client> {
    return this.clientService.getbyId(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  create(@Body() createClientDto, @Req() req) {
    return this.clientService.create(createClientDto, req.user.userId);
  }

  @Put(':id')
  update(
    @Body() updateClientDto: UpdateClientDto,
    @Param('id') id: string,
  ): Promise<Client> {
    return this.clientService.update(id, updateClientDto);
  }

  @Post('image/:id')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.clientService.uploadImage(id, file);
  }

  @Delete('image/:id')
  public async deleteImage(@Param('id') id: string): Promise<string> {
    // return this.clientService.deleteImage(id);
    return;
  }

  @Delete('/:id')
  remove(@Param('id') id: string): Promise<Client> {
    return this.clientService.remove(id);
  }
}
