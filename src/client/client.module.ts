import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from 'src/schemas/client.schema';

@Module({
  providers: [ClientService],
  controllers: [ClientController],
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
})
export class ClientModule {}
