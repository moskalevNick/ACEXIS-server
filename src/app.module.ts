import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './modules/client/client.module';
import { ExisModule } from './modules/exis/exis.module';
import { AvatarModule } from './modules/avatar/avatar.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    ClientModule,
    ExisModule,
    AvatarModule,
  ],
})
export class AppModule {}
