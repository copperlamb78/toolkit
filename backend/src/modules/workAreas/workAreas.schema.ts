import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class WorkAreas {
  @Prop({ required: true })
  name!: string;
}

export const WorkAreasSchema = SchemaFactory.createForClass(WorkAreas);
