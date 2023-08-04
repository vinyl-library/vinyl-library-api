import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadBookCover(file: Express.Multer.File, bookId: string) {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
    const res = await v2.uploader.upload(dataURI, {
      folder: 'vinyl-library',
      resource_type: 'image',
      public_id: `${bookId}`,
    });

    return res;
  }
}
