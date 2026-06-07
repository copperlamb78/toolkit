import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './users.dto';

export class UserRepository {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async create(data: CreateUserDto) {
    return this.userModel.create(data);
  }

  async findAll() {
    return this.userModel.find().exec();
  }
}
