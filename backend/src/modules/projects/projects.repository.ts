import { Model } from 'mongoose';
import { Projects } from './projects.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProjectsControllerDto, CreateProjectsDto } from './projects.dto';

export class projectsRepository {
  constructor(
    @InjectModel(Projects.name) private projectsModel: Model<Projects>,
  ) {}

  async create(data: CreateProjectsDto) {
    return this.projectsModel.create(data);
  }

  async findAll() {
    return this.projectsModel.find().exec();
  }

  async findByCategory(category: string) {
    return this.projectsModel.find({ category }).exec();
  }

  async delete(id: string) {
    return this.projectsModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, data: CreateProjectsControllerDto) {
    return this.projectsModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
