import { Injectable } from '@nestjs/common';
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
    exisDto: Pick<Prisma.ExisCreateInput, 'text'>,
    clientId: Client['id'],
  ) {
    const data: Prisma.ExisUncheckedCreateInput = {
      ...exisDto,
      clientId,
    };

    const createdExis = await this.prisma.exis.create({ data });

    return createdExis;
  }

  async delete(id: Exis['id']): Promise<Exis> {
    return this.prisma.exis.delete({
      where: { id },
    });
  }

  async update(
    id: Exis['id'],
    updateExisDto: Pick<Prisma.ExisUpdateInput, 'text'>,
  ): Promise<Exis> {
    return this.prisma.exis.update({
      where: { id },
      data: updateExisDto,
    });
  }
}
