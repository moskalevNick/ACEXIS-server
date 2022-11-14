import { AuthModule } from './../auth/auth.module';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseStorageProvider } from '../../providers/firebase-storage.provider';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client, ClientSchema } from 'src/modules/client/client.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    AuthModule,
  ],
  providers: [ClientService, FirebaseStorageProvider, AuthModule],
  controllers: [ClientController],
  exports: [ClientService, AuthModule],
})
export class ClientModule {}
