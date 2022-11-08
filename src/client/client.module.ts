import { FirebaseStorageProvider } from './../providers/firebase-storage.provider';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from 'src/schemas/client.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  providers: [ClientService, FirebaseStorageProvider],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {}
