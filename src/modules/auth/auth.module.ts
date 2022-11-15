import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
