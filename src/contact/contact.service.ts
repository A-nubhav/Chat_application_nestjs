import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { helperService } from 'src/helper/helper.service';
import { UserFriendList } from 'src/schema/userFriendList.schema';



@Injectable()
export class ContactService {
    constructor(@InjectModel(UserFriendList.name) private friendListSchema: Model<UserFriendList>,
        private helperService: helperService) { }

    async sendRequest(requestedEmail,user) {
        const requestCreated = await this.friendListSchema.create({
            userSender: user.email,
            userReciever: requestedEmail.email,
            requestStatus:0
        });
        console.log(requestCreated);
        return "message request sent";
    }

    async acceptRequest(acceptEmail: Record<string, any>, user) {
       
        const userstatus = await this.friendListSchema.findOne({ userSender:acceptEmail.email, userReciever: user.email });
        if (userstatus != null && userstatus.requestStatus == 0) {
            await this.friendListSchema.updateOne({ userSender: acceptEmail.email, userReciever: user.email}, { requestStatus: 1 });
            return "request Accepted";
        }
        else if (userstatus != null && userstatus.requestStatus == 1) {
            return "already friend";
        }
        return "no request from give user";
    }

    async rejectRequest(rejectEmail: Record<string, any>,user) {
        const userstatus = await this.friendListSchema.findOne({ userSender: rejectEmail.email, userReciever: user.email });
        if (userstatus != null && userstatus.requestStatus == 1) {
            await this.friendListSchema.updateOne({ userSender: rejectEmail.email, userReciever: user.email}, { requestStatus: -1 });
            return "request rejected";
        }
        else if (userstatus != null && userstatus.requestStatus == 0) {
            return "first accepted the request";
        }
        return "user didn't  requested yet";
    }

    async getAllContact(user){
        const DBdata=await this.friendListSchema.find({userReciever:user.email ,requestStatus:1},{userSender:1});
        if(DBdata.length==0){
            return "no friends";
        }
        else{
            return `your firend list: ${DBdata}`;
        }
    }
}
