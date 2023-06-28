import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log('Listening on port ' + PORT);
  console.log(await app.getUrl());
}
bootstrap();
