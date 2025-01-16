import { Injectable } from '@nestjs/common';
import { EditUserDto } from '../auth/dto/edit-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){

    }
   async editUser(userId:number,dto:EditUserDto){
    
        const user = await this.prisma.user.update({
            where:{
                id:userId
            },
            data:{
                firstName: dto.firstname,
                lastname:dto.lastname,
                email: dto.email
            }
        })
        delete user.hash
        return user
    }
}
