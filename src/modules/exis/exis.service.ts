import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateExisDto } from './dto/create-exis.dto';
import { UpdateExisDto } from './dto/update-exis.dto';
import { ClientService } from '../client/client.service';
import { Client, Exis, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExisService {
  constructor(private prisma: PrismaService) {}

  async getExisesByClientId(clientId: Client['id']): Promise<Exis[]> {
    const exises = await this.prisma.exis.findMany({
      where: { clientId },
    });

    return exises;
  }

  async create(
    exisDto: Omit<Prisma.ExisCreateInput, 'client'>,
    clientId: Client['id'],
  ) {
    const data: Prisma.ExisUncheckedCreateInput = {
      ...exisDto,
      clientId,
    };

    const createdExis = await this.prisma.exis.create({ data });

    return createdExis;
  }

  // async create(exisDto: CreateExisDto): Promise<Exis> {
  //   const client = await this.clientService.getbyId(exisDto.clientId);

  //   await this.clientService.update(client.id, {
  //     ...client,
  //     exisIds: [...client.exisIds, exisDto.id],
  //   });

  //   const newExis = new this.exisModel(exisDto);

  //   return newExis.save();
  // }

  // async remove(id: string): Promise<Exis> {
  //   const exis = await this.getbyId(id);

  //   const client = await this.clientService.getbyId(exis.clientId);
  //   await this.clientService.update(client.id, {
  //     ...client,
  //     exisIds: client.exisIds.filter((id) => id !== exis.id),
  //   });

  //   return this.exisModel.findOneAndDelete({ id });
  // }

  // async update(id: string, exisDto: UpdateExisDto): Promise<Exis> {
  //   return this.exisModel.findOneAndUpdate({ id }, exisDto, {
  //     new: true,
  //   });
  // }
}
