import { FileInterceptor } from '@nestjs/platform-express';
import { Client, Prisma, Image } from '@prisma/client';
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
import { ClientService } from './client.service';
import { JwtAuthGuard } from 'src/commons/guards/accessToken.guard';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Req() req: any): Promise<Client[]> {
    return this.clientService.getClientsByUserId(req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Client> {
    return this.clientService.getbyId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  create(
    @Body()
    createClientDto: Omit<
      Prisma.ClientCreateInput,
      'user' | 'exis' | 'images' | 'visits'
    >,
    @Req() req: any,
  ) {
    return this.clientService.create(createClientDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Body()
    updateClientDto: Omit<
      Prisma.ClientUpdateInput,
      'user' | 'exis' | 'images' | 'visits'
    >,
    @Param('id') id: string,
  ): Promise<Client> {
    return this.clientService.update(id, updateClientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<Client> {
    return this.clientService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('image/:clientId')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @Param('clientId') clientId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Image> {
    return this.clientService.uploadImage(clientId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('image/:id')
  public async deleteImage(@Param('id') id: string): Promise<Image> {
    return this.clientService.deleteImage(id);
  }
}
