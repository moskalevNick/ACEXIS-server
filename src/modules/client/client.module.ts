import { AuthModule } from './../auth/auth.module';
import { Global, Module } from '@nestjs/common';
import { FirebaseStorageProvider } from '../../providers/firebase-storage.provider';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Global()
@Module({
  imports: [AuthModule],
  providers: [ClientService, FirebaseStorageProvider, AuthModule],
  controllers: [ClientController],
  exports: [ClientService, AuthModule],
})
export class ClientModule {}
