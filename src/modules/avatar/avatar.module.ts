import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from 'src/modules/avatar/avatar.schema';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }]),
  ],
  providers: [AvatarService],
  exports: [AvatarService],
  controllers: [AvatarController],
})
export class AvatarModule {}
