import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async registration({
    username,
    password,
    cameraToken,
  }: Pick<User, 'username' | 'password' | 'cameraToken'>): Promise<User> {
    const candidate = await this.userService.findByUsername(username);

    if (candidate) {
      throw new Error('User with this username already exist');
    }

    const hashedPassword = await hash(password);
    const createdUser = await this.userService.create({
      username,
      password: hashedPassword,
      cameraToken,
    });

    return createdUser;
  }

  async login({
    username,
    password,
  }: Pick<User, 'username' | 'password'>): Promise<{
    accessToken: string;
    refreshToken: User['refreshToken'];
  }> {
    const candidate = await this.userService.findByUsername(username);

    if (!candidate) {
      throw new Error('User with this username not found');
    }

    const isPasswordsEqual = await verify(candidate.password, password);

    if (!isPasswordsEqual) {
      throw new Error('Password wrong!');
    }

    const accessToken = this.generateToken(candidate, true);
    const refreshToken = this.generateToken(candidate, false);
    await this.setNewToken(candidate.id, refreshToken);

    if (candidate.refreshToken === null) {
      delete candidate.refreshToken;
    }

    if (candidate.password) {
      delete candidate.password;
    }

    return {
      accessToken,
      refreshToken,
      ...candidate,
    };
  }

  async setNewToken(
    id: User['id'],
    refreshToken: User['refreshToken'],
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async refresh(user: User) {
    const accessToken = this.generateToken(user, true);

    return {
      accessToken,
      user,
    };
  }

  async logout(user: User) {
    return this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });
  }

  generateToken(data: User, isAccessToken: boolean): string {
    const payload = {
      access: isAccessToken,
      username: data.username,
      id: data.id,
    };

    return this.jwtService.sign(payload, {
      algorithm: 'HS512',
      expiresIn: isAccessToken ? '15m' : '30d',
    });
  }
}
