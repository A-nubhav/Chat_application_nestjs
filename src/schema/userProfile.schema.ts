import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true ,unique:true})
  email: string;
  
  @Prop({required:true})
  password:string;

  @Prop()
  name: string;

  @Prop()
  ip:string;

  @Prop()
  isActive:boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
