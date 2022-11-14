import { Injectable } from '@nestjs/common';
import jwt_decode from 'jwt-decode';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client } from 'src/modules/client/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientDocument } from './client.schema';
import { AvatarService } from '../avatar/avatar.service';
import { UsersService } from '../users/users.service';
import { AccessTokenGuard } from 'src/commons/guards/accessToken.guard';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private storageProvider: FirebaseStorageProvider,
    private avatarService: AvatarService,
  ) {}

  async getAll(): Promise<Client[]> {
    return this.clientModel.aggregate([
      {
        $lookup: {
          from: 'avatars',
          localField: 'imgIds',
          foreignField: 'id',
          as: 'avatars',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$$ROOT',
              {
                avatarLink: {
                  $arrayElemAt: ['$avatars.publicUrl', -1],
                },
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'exis',
          localField: 'exisIds',
          foreignField: 'id',
          as: 'exises',
        },
      },
      {
        $unset: ['avatars', 'exisIds'],
      },
    ]);
  }

  async getbyId(id: string): Promise<any> {
    return this.clientModel.findOne({ id }).lean();
  }

  async create(clientDto, request): Promise<Client> {
    const jwt = request.headers.authorization.replace('Bearer ', '');
    const decoded: { sub: string } = jwt_decode(jwt);
    console.log(decoded);

    const client = {
      name: 'Vladik',
      status: 'moon',
      coincidents: [],
      pinnedExisId: '',
      bills: [],
      user: new Types.ObjectId(decoded.sub),
      phoneNumber: '+375447777778',
    };

    const newClient = new this.clientModel(client);
    console.log(newClient);

    // return newClient.save();
    return;
  }

  async getClientsByUserId() {
    return this.clientModel.find({
      user: new Types.ObjectId('6371fc0a23ad21a3814e548c'),
    });
  }

  async remove(id: string): Promise<Client> {
    return this.clientModel.findOneAndDelete({ id });
  }

  async update(id: string, clientDto: UpdateClientDto): Promise<Client> {
    return this.clientModel.findOneAndUpdate({ id }, clientDto, { new: true });
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

  async deleteAvatar(id: string) {
    // const avatar = await this.avatarService.getbyId(id);
    // const client = await this.getbyId(avatar.clientId);
    // await this.update(client.id, {
    //   ...client,
    //   imgIds: client.imgIds.filter((el) => id !== el),
    // });
    // return await this.storageProvider.delete(avatar);
  }
}
