import { Injectable } from '@nestjs/common';
import { Prisma, Client, User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ImageService } from '../image/image.service';
// import { UsersService } from '../users/users.service';
// import { AccessTokenGuard } from 'src/commons/guards/accessToken.guard';
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
        exises: true,
      },
    });

    return client;
  }

  async create(): Promise<Client> {
    const data: Prisma.ClientUncheckedCreateInput = {
      name: 'Vladislav',
      status: 'wheel',
      phone: '+375447772233',
      userId: '63726dd27dbbc6757e1e6c2b',
    };

    const newClient = await this.prisma.client.create({ data });

    return newClient;
  }

  // async remove(id: string): Promise<Client> {
  //   return this.clientModel.findOneAndDelete({ id });
  // }

  // async update(id: string, clientDto: UpdateClientDto): Promise<Client> {
  //   return this.clientModel.findOneAndUpdate({ id }, clientDto, { new: true });
  // }

  async uploadImage(id: string, file: Express.Multer.File): Promise<string> {
    const client = await this.getbyId(id);

    const { fullName, name } = await this.storageProvider.upload(
      file,
      'client-images',
      client.id,
    );

    this.imageService.create({
      path: fullName,
      clientId: client.id,
      publicUrl: `https://firebasestorage.googleapis.com/v0/b/acexis-c375d.appspot.com/o/client-images%2F${name}?alt=media`,
    });

    return `client ${client.name} was successfully updated`;
  }

  // async deleteImage(id: string) {
  // const images = await this.imageService.getbyId(id);
  // const client = await this.getbyId(images.clientId);
  // await this.update(client.id, {
  //   ...client,
  //   imgIds: client.imgIds.filter((el) => id !== el),
  // });
  // return await this.storageProvider.delete(images);
  // }
}
