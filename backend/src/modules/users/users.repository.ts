import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './users.dto';

export class UserRepository {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async create(data: CreateUserDto) {
    return this.userModel.create(data);
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
