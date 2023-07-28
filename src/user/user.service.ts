import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async checkAvailable(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    return !user;
  }
}
