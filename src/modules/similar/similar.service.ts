import { Injectable } from '@nestjs/common';
import { Client, Prisma, Similar, Image, SimilarImage } from '@prisma/client';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';
import { ImageService } from '../image/image.service';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SimilarService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImageService,
    private storageProvider: FirebaseStorageProvider,
  ) {}

  async getSimilarsByClientId(clientId: Client['id']): Promise<Similar[]> {
    const similars = await this.prisma.similar.findMany({
      where: { clientId },
      select: {
        id: true,
        face_id: true,
        base64image: true,
        clientId: true,
        image: true,
      },
    });

    return similars;
  }

  async create(
    createSimilarDto: Omit<Prisma.SimilarUncheckedCreateInput, 'clientId'>,
    clientId: Client['id'],
  ) {
    const data: Prisma.SimilarUncheckedCreateInput = {
      ...createSimilarDto,
      clientId,
    };
    delete data.base64image;
    const createdSimilar = await this.prisma.similar.create({ data });

    const similarImage: Express.Multer.File = {
      fieldname: '',
      originalname: `similar_image___`,
      encoding: '',
      mimetype: '',
      size: createSimilarDto.base64image.length,
      destination: '',
      filename: '',
      path: '',
      buffer: Buffer.from(createSimilarDto.base64image, 'base64'),
      stream: undefined,
    };
    await this.uploadSimilarImage(createdSimilar.id, similarImage);

    return createdSimilar;
  }

  async uploadSimilarImage(
    similarId: string,
    file: Express.Multer.File,
  ): Promise<SimilarImage> {
    const { fullName, name } = await this.storageProvider.upload(
      file,
      'similar-images',
      similarId,
    );

    return this.imageService.uploadSimilarImage({
      path: fullName,
      similarId: similarId,
      publicUrl: `https://firebasestorage.googleapis.com/v0/b/acexis-c375d.appspot.com/o/similar-images%2F${name}?alt=media`,
    });
  }

  async delete(id: Similar['id']): Promise<Similar> {
    const currentSimilar = await this.prisma.similar.findFirst({
      where: { id },
      select: {
        id: true,
        image: true,
        face_id: true,
        base64image: true,
        clientId: true,
      },
    });
    if (!currentSimilar) {
      throw Error('similar not found');
    }
    await this.imageService.deleteSimilarImage(currentSimilar.image.id);

    return this.prisma.similar.delete({
      where: { id },
      select: {
        id: true,
        image: true,
        face_id: true,
        base64image: true,
        clientId: true,
      },
    });
  }
}
