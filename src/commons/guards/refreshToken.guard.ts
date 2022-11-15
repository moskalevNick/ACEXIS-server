import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.body.refreshToken;

    if (!token) {
      throw new Error('Token was not found');
    }

    try {
      const data: { id: User['id']; access: boolean } =
        this.jwtService.verify(token);

      if (!data || data.access) {
        throw new Error('Invalid token');
      }

      const user = await this.userService.findById(data.id);

      if (!user) {
        throw new Error('Invalid token');
      }

      req.user = user;
      return true;
    } catch (error) {
      throw new Error('Something went wrong!');
    }
  }
}
