import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageDocument, Image } from './image.schema';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async create(imageDto: CreateImageDto): Promise<Image> {
    const candidateImage = {
      ...imageDto,
      client: new Types.ObjectId(imageDto.clientId),
    };
    const newImage = new this.imageModel(candidateImage);
    return newImage.save();
  }

  async getbyId(id: string): Promise<Image> {
    return this.imageModel.findOne({ id });
  }

  async getByClientId(clientId: string): Promise<Image[]> {
    return this.imageModel.find({ clientId });
  }
}
