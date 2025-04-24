import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLogininDto } from 'src/DTO/user.login.dto';
import { UserRegisterDto } from 'src/DTO/user.register.dto';
import { User } from 'src/schema/userProfile.schema';
import * as bcrypt from 'bcrypt';
import { helperService } from 'src/helper/helper.service';

// Add this import to any service using cache
import { RedisService } from 'src/redis/redis.service';
import { UserSession } from 'src/schema/userSession.schema';
import { use } from 'passport';


@Injectable()
export class AuthService {
    private readonly saltRounds = 10;
   constructor(@InjectModel(User.name) private UserSchema:Model<User> ,@InjectModel(UserSession.name) private UserSessionSchema:Model<UserSession>,
         private helperService:helperService,private redisService:RedisService){}
         
    async userSignup(userData:UserRegisterDto,ip:string){
        const alreadyExist=await this.UserSchema.findOne({email:userData.email});
        console.log(alreadyExist);
        // return `message `;
        if(alreadyExist){
            return "redirect to login route";
        } 
        const hashPassword=await bcrypt.hash(userData.password, this.saltRounds);
        const user= await this.UserSchema.create({
            email:userData.email,
            password:hashPassword,
            name:userData.name,
            isActive:false,
            ip:ip
        });
        console.log(user);
        return "Account created";
   }    

   async userSignin(userData:UserLogininDto){
        //  console.log(userData.email);
        const userDBdata=await this.UserSchema.findOne({email:userData.email});
        console.log(userDBdata);
        if(!userDBdata){
            return "redirect to signup route";
        }
        // console.log(userDBdata);
        const isMatch=await bcrypt.compare(userData.password,userDBdata.password);
        if(!isMatch){
            return "invalid credentials";
        }
        const token= await this.helperService.generateToken({_id:userDBdata._id,email:userDBdata.email,deviceID:userData.deviceID});
        // console.log(token)
        const deviceSession=await this.UserSessionSchema.findOne({userID:userDBdata._id,isActive:true});
        if(deviceSession!==null && userData.deviceID!=deviceSession.deviceID){
              await this.UserSessionSchema.updateOne({userID:userDBdata._id,deviceID:deviceSession.deviceID},{
                isActive:false,
                logoutAt:Date.now()
              });
              console.log("new device found !!!");
        }
        if(deviceSession!=null && deviceSession.deviceID==userData.deviceID){
            const key:string=userDBdata.email+userData.deviceID;
            await this.redisService.set(key,token,3600);
            return `already logged in Token:${token}`;
        }
        const sessionCreated=await this.UserSessionSchema.create({
                userID:userDBdata._id,
                deviceID:userData.deviceID,
                loginAt:Date.now(),
                isActive:true
        });
        console.log(sessionCreated);
        const key:string=userDBdata.email+userData.deviceID;
        console.log(key);
        await this.redisService.set(key,token,3600);

        return `logged in succesfully Token:${token}`;  
    
   }

   async userSignout(user){ 
    // console.log(user._id);
    const DBdata = await this.UserSchema.findOne({_id:user._id});
    if(DBdata==null){
        return "redirect to signup";
    }
    console.log(user.email ,user._id,user.deviceID);
    const data=await this.UserSessionSchema.findOne({userID:user._id,deviceID:user.deviceID});
    if(data==null){
        return "login first";
    }
    else if(data!=null && data.isActive){
        const key:string=user.email+user.deviceID;
        await  this.redisService.del(key);
        await this.UserSessionSchema.updateOne({userID:user._id,deviceID:user.deviceID},{
            isActive:false,
            logoutAt:Date.now()
        });
        return "logged out successfully";
    }
    else{
        return "already logged out";
    }

   }

}
