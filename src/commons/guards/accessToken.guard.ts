import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Invalid auth header!');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid access token!');
    }

    try {
      const data: { id: User['id']; access: boolean } =
        this.jwtService.verify(token);

      if (!data || !data.access) {
        throw new Error('Invalid token');
      }

      const user = await this.userService.findById(data.id);

      if (!user) {
        throw new Error('Invalid token');
      }

      req.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Something went wrong!');
    }
  }
}
