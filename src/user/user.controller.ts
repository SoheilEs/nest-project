import { Body, Controller, Get,Patch,UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {User} from "@prisma/client"
import { EditUserDto } from '../auth/dto/edit-user.dto';
import { UserService } from './user.service';
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService){

    }

    @Get('me')
    getMe(@GetUser() user:User){
        
        return user
    }
    @Patch("edit")
    editUser(@GetUser('id') userId:number,@Body() userDto:EditUserDto){
    
        
      return  this.userService.editUser(userId,userDto)
    }
}
