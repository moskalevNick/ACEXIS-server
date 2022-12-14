import { Global, Module } from '@nestjs/common';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';
import { SimilarController } from './similar.controller';
import { SimilarService } from './similar.service';

@Global()
@Module({
  controllers: [SimilarController],
  providers: [SimilarService, FirebaseStorageProvider],
  exports: [SimilarService],
})
export class SimilarModule {}
