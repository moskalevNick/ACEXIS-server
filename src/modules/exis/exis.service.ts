import { Injectable } from '@nestjs/common';
import { Client, Exis, Prisma, Visit } from '@prisma/client';

import { VisitService } from './../visits/visit.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExisService {
  constructor(
    private prisma: PrismaService,
    private visitService: VisitService,
  ) {}

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
    const visits = await this.visitService.getVisitsByClientId(clientId);
    let lastVisit: Visit;
    visits.forEach((visit) => {
      if (lastVisit) {
        if (visit.date > lastVisit.date) {
          lastVisit = visit;
        } else {
          return;
        }
      } else {
        lastVisit = visit;
      }
    });

    const threeHoursAgo = new Date(
      new Date().setHours(new Date().getHours() - 3),
    );

    const data: Prisma.ExisUncheckedCreateInput = {
      ...exisDto,
      clientId,
      visitId: lastVisit.date > threeHoursAgo ? lastVisit.id : null,
    };

    const createdExis = await this.prisma.exis.create({ data });

    if (lastVisit && lastVisit.date > threeHoursAgo) {
      await this.visitService.update(lastVisit.id, {
        exisId: createdExis.id,
      });
    }

    return createdExis;
  }

  async delete(id: Exis['id']): Promise<Exis> {
    return this.prisma.exis.delete({
      where: { id },
      select: {
        id: true,
        date: true,
        text: true,
        isPinned: true,
        clientId: true,
        visitId: true,
      },
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
