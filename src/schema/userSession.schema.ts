import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './userProfile.schema';

export type UserDocument = UserSession & Document;

@Schema()
export class UserSession {
   @Prop({required:true,ref:User.name})
    userID:mongoose.Schema.Types.ObjectId;

  @Prop({required:true})
  deviceID:string;

  @Prop({type:Date ,default:Date.now()})
  loginAt:Date;

  @Prop({type:Date})
  logoutAt:Date;
  @Prop()
  isActive:boolean;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
