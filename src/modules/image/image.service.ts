import { Injectable } from '@nestjs/common';
import { Prisma, Image } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  async create(imageDto: Prisma.ImageUncheckedCreateInput): Promise<Image> {
    const newImage = await this.prisma.image.create({ data: imageDto });

    return newImage;
  }

  // async getbyId(id: string): Promise<Image> {
  //   return this.imageModel.findOne({ id });
  // }

  // async getByClientId(clientId: string): Promise<Image[]> {
  //   return this.imageModel.find({ clientId });
  // }
}
