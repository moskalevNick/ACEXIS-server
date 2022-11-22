import { Injectable } from '@nestjs/common';
import { Prisma, Client, User, Image } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ImageService } from '../image/image.service';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';

@Injectable()
export class ClientService {
  constructor(
    private storageProvider: FirebaseStorageProvider,
    private imageService: ImageService,
    private prisma: PrismaService,
  ) {}

  async getClientsByUserId(userId: User['id']): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        phone: true,
        bills: true,
        userId: true,
        images: true,
      },
    });

    return clients;
  }

  async getbyId(id: Client['id']): Promise<any> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
        phone: true,
        bills: true,
        userId: true,
        images: true,
        visits: true,
      },
    });
    return client;
  }

  async create(
    createClientDto: Omit<
      Prisma.ClientCreateInput,
      'id' | 'exis' | 'images' | 'visits' | 'user'
    >,
    userId: User['id'],
  ): Promise<Client> {
    const data: Prisma.ClientUncheckedCreateInput = {
      ...createClientDto,
      userId,
    };

    const newClient = await this.prisma.client.create({
      data,
      select: {
        id: true,
        name: true,
        status: true,
        phone: true,
        bills: true,
        userId: true,
        images: true,
        visits: true,
      },
    });

    return newClient;
  }

  async remove(id: Client['id']): Promise<Client> {
    return this.prisma.client.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
        phone: true,
        bills: true,
        userId: true,
        images: true,
      },
    });
  }

  async update(
    id: Client['id'],
    clientDto: Prisma.ClientUpdateInput,
  ): Promise<Client> {
    return this.prisma.client.update({
      where: {
        id,
      },
      data: {
        ...clientDto,
      },
    });
  }

  async uploadImage(
    clientId: string,
    file: Express.Multer.File,
  ): Promise<Image> {
    const client = await this.getbyId(clientId);

    const { fullName, name } = await this.storageProvider.upload(
      file,
      'client-images',
      client.id,
    );

    return this.imageService.create({
      path: fullName,
      clientId: client.id,
      publicUrl: `https://firebasestorage.googleapis.com/v0/b/acexis-c375d.appspot.com/o/client-images%2F${name}?alt=media`,
    });
  }

  async deleteImage(id: string) {
    return this.imageService.delete(id);
  }
}
