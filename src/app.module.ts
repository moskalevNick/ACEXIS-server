import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { MulterModule } from '@nestjs/platform-express';
import { ExisModule } from './exis/exis.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ClientModule,
    ExisModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    MulterModule.register({ dest: './uploads' }),
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
