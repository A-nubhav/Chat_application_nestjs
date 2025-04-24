import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { Throttle } from '@nestjs/throttler';
// import { GuardGuard } from 'src/guard/guard.guard';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-guard.guard';
import { jwtGuard } from 'src/guards/jwt-guard';
import { ApiBearerAuth } from '@nestjs/swagger';
// import { request } from 'http';

@Controller('message')
export class MessageController {
   
    constructor(private messageService:MessageService){}
    
    @ApiBearerAuth('JWT')
    @UseGuards(jwtGuard)
    @Post()
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    sendMessages(@Body() requestedData:Record<string,any>,@Req() request){
       return this.messageService.sendMessages(request.user,requestedData);
    }

    @ApiBearerAuth('JWT')
    @UseGuards(jwtGuard)
    @Get(':email')
    getMessages(@Query() query:Record<string,any>,@Req() request,@Param('email') param:string){
       return this.messageService.getMessages(request.user,query,param);
    }
}
