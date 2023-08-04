import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CLOUDINARY } from './cloudinary.constants';
import { v2 } from 'cloudinary';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
