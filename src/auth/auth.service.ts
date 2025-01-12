import { Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User,Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService){

  }
  signin(createAuthDto: CreateAuthDto) {
    return {mesg:"login to your account"};
  }

  signup() {
    return {msg:"Create an account"};
  }

}
