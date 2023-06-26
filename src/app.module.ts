import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController],
  providers: [PrismaService],
  imports: [AuthModule],
})
export class AppModule {}
