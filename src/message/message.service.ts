import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { helperService } from 'src/helper/helper.service';
import { UserFriendList } from 'src/schema/userFriendList.schema';
import { UserMessages } from 'src/schema/userMessages.schema';

@Injectable()
export class MessageService {

    constructor(@InjectModel(UserMessages.name) private UserMessagesSchema: Model<UserMessages>, @InjectModel(UserFriendList.name) private UserFriendSchema: Model<UserFriendList>,
        private helperService: helperService) { }
    async sendMessages(user, data: Record<string,any>) {
        const isFriend = await this.UserFriendSchema.findOne({
            requestStatus: 1,
            $or: [
              { userSender: user.email, userReciever: data.email },
              { userSender: data.email, userReciever: user.email },
            ],
          });
        if(isFriend){
          const messageSent= await this.UserMessagesSchema.create({
                senderIDEmail:user.email,
                receiverIDEmail:data.email,
                message:data.message
            });
            console.log(messageSent);
            return "message has been send";
        }
        return "your are not a friend of requested user";

    }

    async getMessages(user, query: Record<string, any>,param:string) {
        const skip = ((query.page) - 1) * (query.limit);
        const receivedMessages=await this.UserMessagesSchema.find({senderIDEmail:param,receiverIDEmail:user.email},{message:1})
        .skip(skip)
        .limit(query.limit)
        .sort({ createdAt: -1 });

        if(receivedMessages==null){
            return "No messages";
        }
        else{
            return `your messages :${receivedMessages[0]}`;
        }

    }
    
}
