import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientDocument } from '../../schemas/client.schema';
import { Client } from 'src/schemas/client.schema';
import { CreateClientDto } from 'src/modules/client/dto/create-client.dto';
import { UpdateClientDto } from 'src/modules/client/dto/update-client.dto';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';
import { AvatarService } from 'src/modules/avatar/avatar.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private storageProvider: FirebaseStorageProvider,
    private avatarService: AvatarService,
  ) {}

  async getAll(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  async getbyId(id: string): Promise<Client> {
    return this.clientModel.findOne({ id }).lean();
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

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<string> {
    const client = await this.getbyId(id);
    const avatarId = await this.storageProvider.upload(
      file,
      'client-avatars',
      id,
    );

    if (client) {
      try {
        this.update(id, { ...client, imgIds: [...client.imgIds, avatarId] });
      } catch (e) {
        console.log('something went wrong: ', e);
        return "can't add photo to client";
      }
    } else return 'client not found';

    return `client ${client.name} was successfully updated`;
  }

  async deleteAvatar(id: string): Promise<string> {
    const avatar = await this.avatarService.getbyId(id);
    const client = await this.getbyId(avatar.clientId);
    await this.update(client.id, {
      ...client,
      imgIds: client.imgIds.filter((el) => id !== el),
    });

    return await this.storageProvider.delete(avatar);
  }
}