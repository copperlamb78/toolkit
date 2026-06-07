import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Projects {
  @Prop({ required: true })
  userId!: string;
  @Prop({ required: true })
  name!: string;
  @Prop({ required: true })
  description!: string;
  @Prop({ required: true })
  photosList!: string[];
  @Prop({ required: true })
  category!: string;
}
export const ProjectsSchema = SchemaFactory.createForClass(Projects);
