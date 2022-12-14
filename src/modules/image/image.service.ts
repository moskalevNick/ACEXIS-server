import { Injectable } from '@nestjs/common';
import { Prisma, Image, userAvatar, SimilarImage } from '@prisma/client';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(
    private prisma: PrismaService,
    private storageProvider: FirebaseStorageProvider,
  ) {}

  async create(imageDto: Prisma.ImageUncheckedCreateInput): Promise<Image> {
    const newImage = await this.prisma.image.create({ data: imageDto });

    return newImage;
  }

  async delete(id: Image['id']): Promise<Image> {
    const image = await this.prisma.image.findFirst({ where: { id } });
    await this.storageProvider.delete(image.path);

    return await this.prisma.image.delete({
      where: { id },
    });
  }

  async getbyId(id: Image['id']): Promise<Image> {
    return this.prisma.image.findUnique({
      where: { id },
    });
  }

  async getByClientId(clientId: Image['clientId']): Promise<Image[]> {
    return this.prisma.image.findMany({
      where: { clientId },
    });
  }

  async createUserAvatar(
    imageDto: Prisma.userAvatarUncheckedCreateInput,
  ): Promise<userAvatar> {
    const oldAvatar = await this.prisma.userAvatar.findFirst({
      where: { userId: imageDto.userId },
    });

    if (oldAvatar) {
      await this.storageProvider.delete(oldAvatar.path);
      await this.prisma.userAvatar.delete({
        where: { id: oldAvatar.id },
      });
    }

    const newAvatar = await this.prisma.userAvatar.create({ data: imageDto });

    return newAvatar;
  }

  async uploadSimilarImage(
    imageDto: Prisma.SimilarImageUncheckedCreateInput,
  ): Promise<SimilarImage> {
    return this.prisma.similarImage.create({ data: imageDto });
  }

  async deleteSimilarImage(id: SimilarImage['id']): Promise<SimilarImage> {
    const similarImage = await this.prisma.similarImage.findFirst({
      where: { id },
    });

    await this.storageProvider.delete(similarImage.path);

    return await this.prisma.similarImage.delete({
      where: { id },
    });
  }
}
