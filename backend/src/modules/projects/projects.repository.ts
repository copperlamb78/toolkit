import { Model } from 'mongoose';
import { Projects } from './projects.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProjectsDto } from './projects.dto';

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
}
