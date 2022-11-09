import { Controller, Get, Param } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { Avatar } from 'src/schemas/avatar.schema';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get('/:id')
  getOne(@Param('id') id: string): Promise<Avatar> {
    return this.avatarService.getbyId(id);
  }
}
