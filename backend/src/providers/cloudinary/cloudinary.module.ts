import { Module } from '@nestjs/common';
import { cloudinaryHelper } from './cloudinary.helper';

@Module({
  providers: [cloudinaryHelper],
  exports: [cloudinaryHelper],
})
export class cloudinaryModule {}
