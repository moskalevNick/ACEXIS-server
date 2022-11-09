import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExisDocument } from '../../schemas/exis.schema';
import { Exis } from 'src/schemas/exis.schema';
import { CreateExisDto } from './dto/create-exis.dto';
import { UpdateExisDto } from './dto/update-exis.dto';

@Injectable()
export class ExisService {
  constructor(@InjectModel(Exis.name) private exisModel: Model<ExisDocument>) {}

  async getbyId(id: string): Promise<Exis> {
    return this.exisModel.findOne({ id });
  }

  async create(exisDto: CreateExisDto): Promise<Exis> {
    const newExis = new this.exisModel(exisDto);
    return newExis.save();
  }

  async remove(id: string): Promise<Exis> {
    return this.exisModel.findOneAndDelete({ id });
  }

  async update(id: string, exisDto: UpdateExisDto): Promise<Exis> {
    return this.exisModel.findOneAndUpdate({ id }, exisDto, {
      new: true,
    });
  }
}
