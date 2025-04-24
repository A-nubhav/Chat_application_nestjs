import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
// import { GuardGuard } from 'src/guard/guard.guard';
import { request } from 'http';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-guard.guard';
import { jwtGuard } from 'src/guards/jwt-guard';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) { }
    
    @ApiBearerAuth('JWT')
    @UseGuards(jwtGuard)
    @Post('request')
    sendRequest(@Body() requestedEmail: Record<string, any>, @Req() request) {
        return this.contactService.sendRequest(requestedEmail,request.user);
    }
    
    @ApiBearerAuth('JWT')
    @UseGuards(jwtGuard)
    @Post('accept')
    acceptRequest(@Body() acceptEmail: Record<string, any>, @Req() request) {
        return this.contactService.acceptRequest(acceptEmail, request.user);
    }

    @ApiBearerAuth('JWT')
    @UseGuards(jwtGuard)
    @Post('reject')
    rejectRequest(@Body() rejectEmail: Record<string, any>, @Req() request) {
        return this.contactService.rejectRequest(rejectEmail,request.user);
    }

    @ApiBearerAuth('JWT')
    @UseGuards(jwtGuard)
    @Get('')
    allContact(@Req() request){
        return this.contactService.getAllContact(request.user);
    }
}
