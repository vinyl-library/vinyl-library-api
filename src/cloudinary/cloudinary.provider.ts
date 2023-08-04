import { v2 } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'drrw0n4eg',
      api_key: '794242867665624',
      api_secret: '8nW_RQouSPaS-NYmm6xMT6BJuaI',
      secure: true,
    });
  },
};
