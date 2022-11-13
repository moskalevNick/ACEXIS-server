import { Controller, Get, Param } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { Avatar } from 'src/modules/avatar/avatar.schema';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get('/:clientId')
  getOne(@Param('clientId') clientId: string): Promise<Avatar[]> {
    return this.avatarService.getByClientId(clientId);
  }
}
