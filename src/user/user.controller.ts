import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
// import { GuardGuard } from 'src/guard/guard.guard';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-guard.guard';
import { jwtGuard } from 'src/guards/jwt-guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor(private userservice:UserService){}

    @ApiBearerAuth('JWT')
    @UseGuards(jwtGuard)
    @Get("/profile")
    getProfile(@Req() request){
     return this.userservice.getProfile(request.user);
    }
}
