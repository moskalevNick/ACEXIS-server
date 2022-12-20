import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { User } from '@prisma/client';

import { JwtRefreshGuard } from '../../commons/guards/refreshToken.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  registration(@Body() userDto: Pick<User, 'username' | 'password'>) {
    return this.authService.registration(userDto);
  }

  @Post('/login')
  login(@Body() userDto: Pick<User, 'username' | 'password'>) {
    return this.authService.login(userDto);
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() { user }) {
    return this.authService.refresh(user);
  }

  @Post('/logout')
  @UseGuards(JwtRefreshGuard)
  logout(@Req() { user }) {
    return this.authService.logout(user);
  }
}
