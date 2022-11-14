import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from 'src/modules/image/image.schema';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  providers: [ImageService],
  exports: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
