import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/userProfile.schema';
import { helperModule } from 'src/helper/helper.module';
import { AuthService } from './auth.service';

import { RedisModule } from 'src/redis/redis.module';
import { UserSession, UserSessionSchema } from 'src/schema/userSession.schema';


@Module({
  imports:[ MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{name:UserSession.name,schema:UserSessionSchema}]),helperModule,RedisModule],
  controllers: [AuthController],  
  providers:[AuthService]
})
export class AuthModule {}
