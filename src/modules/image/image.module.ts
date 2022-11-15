import { Global, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';

@Global()
@Module({
  providers: [ImageService, FirebaseStorageProvider],
  exports: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
