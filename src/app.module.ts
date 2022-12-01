import { RecognizerModule } from './modules/recognizer/recognizer.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './modules/client/client.module';
import { ExisModule } from './modules/exis/exis.module';
import { ImageModule } from './modules/image/image.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { VisitModule } from './modules/visits/visit.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    ClientModule,
    ExisModule,
    VisitModule,
    ImageModule,
    UsersModule,
    AuthModule,
    RecognizerModule,
  ],
})
export class AppModule {}
