import { Injectable } from '@nestjs/common';
import { Client, Prisma, Visit } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VisitService {
  constructor(private prisma: PrismaService) {}

  async getVisitsByClientId(clientId: Client['id']): Promise<Visit[]> {
    const visits = await this.prisma.visit.findMany({
      where: { clientId },
      select: {
        id: true,
        date: true,
        exisId: true,
        clientId: true,
        exis: true,
      },
    });

    return visits;
  }

  async create(
    visitDto: Pick<Prisma.VisitUncheckedCreateInput, 'exis'>,
    clientId: Client['id'],
  ) {
    const data: Prisma.VisitUncheckedCreateInput = {
      ...visitDto,
      clientId,
    };

    const createdVisit = await this.prisma.visit.create({ data });

    return createdVisit;
  }

  async update(visitId: Visit['id'], visitDto: Prisma.VisitUpdateInput) {
    const createdVisit = await this.prisma.visit.update({
      where: {
        id: visitId,
      },
      data: {
        ...visitDto,
      },
    });

    return createdVisit;
  }
}
