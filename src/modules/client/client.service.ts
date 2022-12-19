import { SimilarService } from './../similar/similar.service';
import { clientFilterDto } from './dto/clientFilter.dto';
import { Injectable } from '@nestjs/common';
import { Prisma, Client, User, Image, Visit } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ImageService } from '../image/image.service';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';
import { VisitService } from '../visits/visit.service';
import { ExisService } from '../exis/exis.service';

@Injectable()
export class ClientService {
  constructor(
    private storageProvider: FirebaseStorageProvider,
    private visitService: VisitService,
    private similarService: SimilarService,
    private exisService: ExisService,
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
        averageBill: true,
        billsAmount: true,
        userId: true,
        images: true,
        visits: true,
        exises: true,
        face_id: true,
        lastIdentified: true,
        similar: true,
        lastVisitDate: true,
      },
    });

    return clients;
  }

  async getClientsWithFilters(
    filterDto: clientFilterDto,
    userId: User['id'],
  ): Promise<Client[]> {
    const { searchString, dateFrom, dateTo, billFrom, billTo, status } =
      filterDto;
    const clients = await this.prisma.client.findMany({
      where: {
        AND: [
          {
            userId,
            status: {
              in: status,
            },
            visits: {
              every: {
                AND: [
                  {
                    date: {
                      gte: dateFrom,
                      lte: dateTo,
                    },
                  },
                  {
                    OR: [],
                  },
                ],
              },
            },
            averageBill: {
              gte: +billFrom,
              lte: +billTo,
            },
          },
          {
            OR: [
              {
                name: { contains: searchString, mode: 'insensitive' },
              },
              {
                phone: { contains: searchString, mode: 'insensitive' },
              },
              {
                exises: {
                  some: {
                    text: {
                      contains: searchString,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
        phone: true,
        averageBill: true,
        billsAmount: true,
        userId: true,
        images: true,
        visits: true,
        exises: true,
        face_id: true,
        lastIdentified: true,
        lastVisitDate: true,
        similar: {
          select: {
            id: true,
            face_id: true,
            base64image: true,
            clientId: true,
            image: true,
          },
        },
      },
      orderBy: {
        lastVisitDate: 'desc',
      },
    });

    return clients;
  }

  async getbyId(id: Client['id']): Promise<
    Prisma.ClientGetPayload<{
      include: {
        images: true;
        visits: true;
        exises: true;
        similar: true;
      };
    }>
  > {
    const client = await this.prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
        phone: true,
        averageBill: true,
        billsAmount: true,
        userId: true,
        images: true,
        visits: true,
        exises: true,
        face_id: true,
        lastIdentified: true,
        lastVisitDate: true,
        similar: {
          select: {
            id: true,
            face_id: true,
            base64image: true,
            clientId: true,
            image: true,
          },
        },
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
        averageBill: true,
        billsAmount: true,
        userId: true,
        images: true,
        visits: true,
        face_id: true,
        lastIdentified: true,
        similar: true,
        lastVisitDate: true,
      },
    });

    return newClient;
  }

  async delete(id: Client['id']): Promise<Client> {
    const client = await this.getbyId(id);
    if (client.images.length) {
      client.images.forEach((image) => {
        this.deleteImage(image.id);
      });
    }

    if (client.visits.length) {
      client.visits.forEach((visit) => {
        this.visitService.delete(visit.id);
      });
    }

    if (client.exises.length) {
      client.exises.forEach((exis) => {
        this.exisService.delete(exis.id);
      });
    }

    if (client.similar.length) {
      client.similar.forEach((similar) => {
        this.similarService.delete(similar.id);
      });
    }

    return this.prisma.client.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
        phone: true,
        averageBill: true,
        billsAmount: true,
        userId: true,
        images: true,
        face_id: true,
        lastIdentified: true,
        similar: true,
        lastVisitDate: true,
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
      select: {
        id: true,
        name: true,
        status: true,
        phone: true,
        averageBill: true,
        billsAmount: true,
        userId: true,
        images: true,
        face_id: true,
        lastIdentified: true,
        similar: true,
        lastVisitDate: true,
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
