import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import * as argon2 from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SigninAuthDto } from './dto/sigin-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';




@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt:JwtService,private config:ConfigService){}
 
  async signup(SignupAuthDto: SignupAuthDto) {
    const { firstname, lastname, email, password } = SignupAuthDto;
    const hash = await argon2.hash(password);
    
    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: firstname,
          lastname: lastname,
          email,
          hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return user;
    } catch (err) {
      
  
      if (err instanceof PrismaClientKnownRequestError) {
        // Check if the error code is 'P2002' for unique constraint violation
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
  
      // Rethrow if it's not the error you are expecting
      throw err;
    }
  }
  

  async signin(SigninAuthDto: SigninAuthDto) {
    const {email,password} = SigninAuthDto
    const user = await this.prisma.user.findFirst({
      where:{
        email
      },

    })
    if(!user) throw new HttpException('Email or Password is invalid', HttpStatus.BAD_REQUEST)
    const compareResult = await argon2.verify(user.hash,password)
    if(!compareResult) throw new HttpException('Email or Password is invalid', HttpStatus.BAD_REQUEST)
    
    delete user.hash
    
    const accessToken = await this.signToken({
      id:user.id,
      email:user.email
    })
    return {
      accessToken 
  } ;
  }
  async signToken(userInfo:{id:number,email:string}): Promise<string>{
    return await this.jwt.signAsync(userInfo,{
      expiresIn: 24 * 60 * 60 * 1000, // 1 DAY
      secret: this.config.get("JWT_SECRET")
    })
  }
}
