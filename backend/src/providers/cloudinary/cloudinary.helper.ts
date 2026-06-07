import { cloudinary } from './cloudinary.config';
import { Injectable } from '@nestjs/common';

type UploadFolder = 'users' | 'projects';
type UploadFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
};

@Injectable()
export class cloudinaryHelper {
  async uploadFiles(files: UploadFile[], folder: UploadFolder) {
    return Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder,
                resource_type: 'auto',
              },
              (error, result) => {
                if (error)
                  return reject(
                    new Error(error.message || 'Cloudinary upload failed'),
                  );

                resolve({
                  url: result?.secure_url,
                  publicId: result?.public_id,
                });
              },
            )
            .end(file.buffer);
        });
      }),
    );
  }
}
