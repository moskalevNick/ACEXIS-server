import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: Pick<Prisma.UserCreateInput, 'username' | 'password'>,
  ): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: createUserDto,
    });

    return createdUser;
  }

  async findAll(): Promise<any> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        password: true,
        refreshToken: true,
        clients: true,
      },
    });
  }

  async findById(id: User['id']): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: User['username']): Promise<User> {
    return this.prisma.user.findFirst({
      where: { username },
    });
  }

  async updateRefreshToken(id: User['id'], refreshToken: User['refreshToken']) {
    this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  // async update(
  //   id: string,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<UserDocument> {
  //   return this.userModel
  //     .findByIdAndUpdate(id, updateUserDto, { new: true })
  //     .exec();
  // }

  // async remove(id: string): Promise<UserDocument> {
  //   return this.userModel.findByIdAndDelete(id).exec();
  // }
}
