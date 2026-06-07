import { InjectModel } from '@nestjs/mongoose';
import { WorkAreas } from './workAreas.schema';
import { CreateWorkAreasDto } from './workAreas.dto';
import { Model } from 'mongoose';

export class WorkAreasRepository {
  constructor(
    @InjectModel(WorkAreas.name) private workAreasModel: Model<WorkAreas>,
  ) {}

  async create(data: CreateWorkAreasDto) {
    return this.workAreasModel.create(data);
  }

  async createBatch(items: CreateWorkAreasDto[]) {
    return this.workAreasModel.insertMany(items);
  }

  async findAll() {
    return this.workAreasModel.find().exec();
  }
}
