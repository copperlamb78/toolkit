import { CreateCategoryBatchDto, CreateCategoryDto } from './category.dto';
import { categoryRepository } from './category.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: categoryRepository) {}

  async create(data: CreateCategoryDto) {
    const existingCategory = await this.categoryRepository.findAll();
    const existingCategoryNames = existingCategory.map(
      (category) => category.name,
    );
    if (existingCategoryNames) {
      throw new BadRequestException('Category already exists');
    }

    return this.categoryRepository.create(data);
  }

  async createBatch(categorys: CreateCategoryBatchDto) {
    const existingCategory = await this.categoryRepository.findAll();
    const existingNames = existingCategory.map(
      (categoryName) => categoryName.name,
    );
    const duplicateNames = categorys.items
      .map((item) => item.name)
      .filter((name, index, self) => self.indexOf(name) !== index);
    const alreadyExistingNames = categorys.items
      .map((item) => item.name)
      .filter((name) => existingNames.includes(name));

    if (duplicateNames.length > 0) {
      throw new BadRequestException('Nomes das categorias duplicados');
    }

    if (alreadyExistingNames.length > 0) {
      throw new BadRequestException('Categorias já existentes');
    }
    return this.categoryRepository.createBatch(categorys.items);
  }

  async findAll() {
    const category = await this.categoryRepository.findAll();
    return category.map((category) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __v, ...result } = category.toObject();
      return result;
    });
  }
}
