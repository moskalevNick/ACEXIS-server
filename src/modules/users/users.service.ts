import { Injectable } from '@nestjs/common';
import { Prisma, User, userAvatar } from '@prisma/client';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';
import { ImageService } from '../image/image.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private storageProvider: FirebaseStorageProvider,
    private imageService: ImageService,
  ) {}

  async create(
    createUserDto: Pick<
      Prisma.UserCreateInput,
      'username' | 'password' | 'cameraToken'
    >,
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
      select: {
        id: true,
        password: true,
        refreshToken: true,
        username: true,
        minBill: true,
        maxBill: true,
        chatId: true,
        isRus: true,
        isDark: true,
        avatar: true,
        role: true,
        cameraToken: true,
      },
    });
  }

  async findByUsername(username: User['username']): Promise<User> {
    return this.prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        password: true,
        refreshToken: true,
        username: true,
        minBill: true,
        maxBill: true,
        chatId: true,
        isRus: true,
        isDark: true,
        avatar: true,
        role: true,
        cameraToken: true,
      },
    });
  }

  async updateRefreshToken(id: User['id'], refreshToken: User['refreshToken']) {
    this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async update(
    id: User['id'],
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }

  async uploadImage(
    id: User['id'],
    file: Express.Multer.File,
  ): Promise<userAvatar> {
    const { fullName, name } = await this.storageProvider.upload(
      file,
      'user-images',
      id,
    );

    return this.imageService.createUserAvatar({
      path: fullName,
      userId: id,
      publicUrl: `https://firebasestorage.googleapis.com/v0/b/acexis-c375d.appspot.com/o/user-images%2F${name}?alt=media`,
    });
  }

  // async delete(id: string): Promise<UserDocument> {
  //   return this.userModel.findByIdAndDelete(id).exec();
  // }
}
