import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from 'src/schemas/avatar.schema';
import { AvatarService } from './avatar.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }]),
  ],
  providers: [AvatarService],
  exports: [AvatarService],
})
export class AvatarModule {}
