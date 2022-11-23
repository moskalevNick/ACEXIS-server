import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, Image, userAvatar } from '@prisma/client';
import { JwtAuthGuard } from 'src/commons/guards/accessToken.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req: any, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<userAvatar> {
    return this.usersService.uploadImage(req.user.id, file);
  }

  // @UseGuards(JwtAuthGuard)
  // @Delete('image/:id')
  // public async deleteImage(@Param('id') id: string): Promise<Image> {
  //   return this.clientService.deleteImage(id);
  // }

  // @Get(':id')
  // findById(@Param('id') id: string) {
  //   return this.usersService.findById(id);
  // }

  // @UseGuards(AccessTokenGuard)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // }
}
