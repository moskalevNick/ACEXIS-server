import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { AvatarDocument, Avatar } from '../../schemas/avatar.schema';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>,
  ) {}

  async create(avatarDto: CreateAvatarDto): Promise<Avatar> {
    const newAvatar = new this.avatarModel(avatarDto);
    return newAvatar.save();
  }

  async getbyId(id: string): Promise<Avatar> {
    return this.avatarModel.findOne({ id });
  }
}
