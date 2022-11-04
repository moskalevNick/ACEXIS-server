import { ClientDocument } from './../schemas/client.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from 'src/schemas/client.schema';
import { CreateClientDto } from 'src/dto/create-client.dto';
import { UpdateClientDto } from 'src/dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async getAll(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  async getbyId(id: string): Promise<Client> {
    return this.clientModel.findOne({ id });
  }

  async create(clientDto: CreateClientDto): Promise<Client> {
    const newClient = new this.clientModel(clientDto);
    return newClient.save();
  }

  async remove(id: string): Promise<Client> {
    return this.clientModel.findOneAndDelete({ id });
  }

  async update(id: string, clientDto: UpdateClientDto): Promise<Client> {
    return this.clientModel.findOneAndUpdate({ id }, clientDto, {
      new: true,
    });
  }
}
