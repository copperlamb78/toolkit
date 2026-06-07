import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Users {
  @Prop({ required: true })
  name!: string;
  @Prop({ required: true })
  email!: string;
  @Prop({ required: true })
  password!: string;
  @Prop({ required: false })
  description!: string;
  @Prop({ required: false })
  avatar!: string;
  @Prop({ required: false })
  linkGithub!: string;
  @Prop({ required: false })
  linkLinkedin!: string;
  @Prop({ required: false })
  username!: string;
  @Prop({ required: false, default: Date.now })
  createdAt!: Date;
  @Prop({ required: false })
  workAreas!: string[];
}

export const UserSchema = SchemaFactory.createForClass(Users);
