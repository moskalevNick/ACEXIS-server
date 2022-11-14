import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client } from 'src/modules/client/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientDocument } from './client.schema';
import { ImageService } from '../image/image.service';
import { UsersService } from '../users/users.service';
import { AccessTokenGuard } from 'src/commons/guards/accessToken.guard';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private storageProvider: FirebaseStorageProvider,
    private imageService: ImageService,
  ) {}

  async getAll(): Promise<Client[]> {
    return this.clientModel.aggregate([
      {
        $lookup: {
          from: 'images',
          localField: 'imgIds',
          foreignField: 'id',
          as: 'images',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$$ROOT',
              {
                avatarLink: {
                  $arrayElemAt: ['$images.publicUrl', -1],
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
        $unset: ['images', 'exisIds'],
      },
    ]);
  }

  async getbyId(id: string): Promise<any> {
    return this.clientModel.findOne({ id });
  }

  async create(clientDto, userId): Promise<Client> {
    const client = {
      ...clientDto,
      user: new Types.ObjectId(userId),
    };

    const newClient = new this.clientModel(client);
    return newClient.save();
  }

  async getClientsByUserId(id: Types.ObjectId) {
    return await this.clientModel.find({ userId: id }).populate('images');
  }

  async remove(id: string): Promise<Client> {
    return this.clientModel.findOneAndDelete({ id });
  }

  async update(id: string, clientDto: UpdateClientDto): Promise<Client> {
    return this.clientModel.findOneAndUpdate({ id }, clientDto, { new: true });
  }

  async uploadImage(id: string, file: Express.Multer.File): Promise<string> {
    const client = await this.getbyId(id);

    const { fullName, name } = await this.storageProvider.upload(
      file,
      'client-images',
      id,
    );

    this.imageService.create({
      path: fullName,
      clientId: client.id,
      publicUrl: `https://firebasestorage.googleapis.com/v0/b/acexis-c375d.appspot.com/o/client-images%2F${name}?alt=media`,
    });

    return `client ${client.name} was successfully updated`;
  }

  async deleteImage(id: string) {
    // const images = await this.imageService.getbyId(id);
    // const client = await this.getbyId(images.clientId);
    // await this.update(client.id, {
    //   ...client,
    //   imgIds: client.imgIds.filter((el) => id !== el),
    // });
    // return await this.storageProvider.delete(images);
  }
}
