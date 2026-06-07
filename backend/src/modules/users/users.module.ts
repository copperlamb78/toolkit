import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './users.schema';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { WorkAreasModule } from '../workAreas/workAreas.module';
import { cloudinaryModule } from 'src/providers/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    WorkAreasModule,
    cloudinaryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
