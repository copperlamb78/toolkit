import { cloudinaryHelper } from 'src/providers/cloudinary/cloudinary.helper';
import { CreateProjectsControllerDto, CreateProjectsDto } from './projects.dto';
import { projectsRepository } from './projects.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: projectsRepository,
    private readonly cloudinaryHelper: cloudinaryHelper,
    private readonly categoryService: CategoryService,
  ) {}

  async create(data: CreateProjectsDto, files: any[]) {
    const existingProjects = await this.projectsRepository
      .findAll()
      .then((projects) =>
        projects.find((projects) => {
          return projects.name === data.name;
        }),
      );

    if (existingProjects) {
      throw new BadRequestException('Já existe um projeto com esse nome');
    }

    const photos = await this.cloudinaryHelper.uploadFiles(
      files.map((photo: any) => ({
        buffer: photo.buffer,
        originalname: photo.originalname,
        mimetype: photo.mimetype,
      })),
      'projects',
    );

    const photosUrls = photos.map((photo: any) => photo.url);

    return this.projectsRepository.create({
      ...data,
      photosList: photosUrls,
    });
  }

  async findAll() {
    return this.projectsRepository.findAll();
  }

  async findByCategory(category: string) {
    const categories = await this.categoryService.findAll();
    const existingCategory = categories.find((dbCategory) => {
      return dbCategory.name === category;
    });

    if (!existingCategory) {
      throw new BadRequestException('Categoria não encontrada');
    }

    return this.projectsRepository.findByCategory(category);
  }

  async delete(id: string) {
    const projectsExisting = await this.findAll().then((projects) =>
      projects.find((projects) => {
        return String(projects['_id']) === String(id);
      }),
    );

    if (!projectsExisting) {
      throw new BadRequestException('Projeto não encontrado');
    }

    return this.projectsRepository.delete(id);
  }

  async update(id: string, data: CreateProjectsControllerDto, files: any[]) {
    const projectsExisting = await this.findAll().then((projects) =>
      projects.find((projects) => {
        return String(projects['_id']) === String(id);
      }),
    );

    if (!projectsExisting) {
      throw new BadRequestException('Projeto não encontrado');
    }

    const photos = await this.cloudinaryHelper.uploadFiles(
      files.map((photo: any) => ({
        buffer: photo.buffer,
        originalname: photo.originalname,
        mimetype: photo.mimetype,
      })),
      'projects',
    );

    const photosUrls = photos.map((photo: any) => photo.url);

    return this.projectsRepository.update(id, {
      ...data,
      photosList: photosUrls,
    });
  }
}
