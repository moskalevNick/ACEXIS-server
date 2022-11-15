import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/commons/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/commons/guards/refreshToken.guard';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: Pick<User, 'username' | 'password'>,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.signUp(createUserDto);
    response.cookie('refresh-token', tokens.refreshToken);
    return tokens;
  }

  @Post('signin')
  async signin(
    @Body() data: Pick<User, 'username' | 'password'>,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.signIn(data);
    response.cookie('refresh-token', tokens.refreshToken);
    return tokens;
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['userId']);
  }

  // @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request) {
    // const userId = req.user['userId'];
    const refreshToken = req.cookies['refresh-token'];

    // console.log('userId', userId);
    console.log('refreshToken', refreshToken);

    // return this.authService.refreshTokens(userId, refreshToken);
  }
}
