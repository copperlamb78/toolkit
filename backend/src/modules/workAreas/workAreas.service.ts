import { Injectable } from '@nestjs/common';
import { CreateWorkAreasBatchDto, CreateWorkAreasDto } from './workAreas.dto';
import { WorkAreasRepository } from './workAreas.repository';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class WorkAreasService {
  constructor(private readonly workAreasRepository: WorkAreasRepository) {}

  async create(data: CreateWorkAreasDto) {
    const existingWorkArea = await this.workAreasRepository
      .findAll()
      .then((workAreas) =>
        workAreas.find((workArea) => workArea.name === data.name),
      );

    if (existingWorkArea) {
      throw new BadRequestException('Área de atuação já existe');
    }

    return this.workAreasRepository.create(data);
  }

  async createBatch(items: CreateWorkAreasBatchDto) {
    const existingWorkAreas = await this.workAreasRepository.findAll();
    const existingNames = existingWorkAreas.map((workArea) => workArea.name);
    const duplicateNames = items.items
      .map((item) => item.name)
      .filter((name, index, self) => self.indexOf(name) !== index);
    const alreadyExistingNames = items.items
      .map((item) => item.name)
      .filter((name) => existingNames.includes(name));

    if (duplicateNames.length > 0) {
      throw new BadRequestException('Nomes de áreas de atuação duplicados');
    }

    if (alreadyExistingNames.length > 0) {
      throw new BadRequestException('Áreas de atuação já existentes');
    }

    return this.workAreasRepository.createBatch(items.items);
  }

  async findAll() {
    const workAreas = await this.workAreasRepository.findAll();
    return workAreas.map((workArea) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __v, ...result } = workArea.toObject();
      return result;
    });
  }
}
