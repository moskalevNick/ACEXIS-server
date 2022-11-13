import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExisDocument } from './exis.schema';
import { Exis } from 'src/modules/exis/exis.schema';
import { CreateExisDto } from './dto/create-exis.dto';
import { UpdateExisDto } from './dto/update-exis.dto';
import { ClientService } from '../client/client.service';

@Injectable()
export class ExisService {
  constructor(
    @InjectModel(Exis.name) private exisModel: Model<ExisDocument>,
    private clientService: ClientService,
  ) {}

  async getbyId(id: string): Promise<Exis> {
    return this.exisModel.findOne({ id });
  }

  async create(exisDto: CreateExisDto): Promise<Exis> {
    const client = await this.clientService.getbyId(exisDto.clientId);

    await this.clientService.update(client.id, {
      ...client,
      exisIds: [...client.exisIds, exisDto.id],
    });

    const newExis = new this.exisModel(exisDto);

    return newExis.save();
  }

  async remove(id: string): Promise<Exis> {
    const exis = await this.getbyId(id);

    const client = await this.clientService.getbyId(exis.clientId);
    await this.clientService.update(client.id, {
      ...client,
      exisIds: client.exisIds.filter((id) => id !== exis.id),
    });

    return this.exisModel.findOneAndDelete({ id });
  }

  async update(id: string, exisDto: UpdateExisDto): Promise<Exis> {
    return this.exisModel.findOneAndUpdate({ id }, exisDto, {
      new: true,
    });
  }
}
