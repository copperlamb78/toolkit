import { Model } from 'mongoose';
import { Category } from './category.schema';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { CreateCategoryDto } from './category.dto';

export class categoryRepository {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(name: CreateCategoryDto) {
    return this.categoryModel.create(name);
  }

  async createBatch(items: CreateCategoryDto[]) {
    return this.categoryModel.insertMany(items);
  }

  async findAll() {
    return this.categoryModel.find().exec();
  }
}
