import { Module } from '@nestjs/common';
import { WorkAreasController } from './workAreas.controller';
import { WorkAreasService } from './workAreas.service';
import { WorkAreasRepository } from './workAreas.repository';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { WorkAreas, WorkAreasSchema } from './workAreas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkAreas.name, schema: WorkAreasSchema },
    ]),
  ],
  controllers: [WorkAreasController],
  providers: [WorkAreasService, WorkAreasRepository],
})
export class WorkAreasModule {}
