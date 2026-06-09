import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { projectsRepository } from './projects.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Projects, ProjectsSchema } from './projects.schema';
import { cloudinaryModule } from '../../providers/cloudinary/cloudinary.module';
import { ProjectsController } from './projects.controller';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Projects.name, schema: ProjectsSchema },
    ]),
    cloudinaryModule,
    CategoryModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, projectsRepository],
  exports: [ProjectsService],
})
export class ProjectsModule {}
