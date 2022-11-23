import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ImageService } from '../image/image.service';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';

@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService, ImageService, FirebaseStorageProvider],
  exports: [UsersService],
})
export class UsersModule {}
