import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { SigninAuthDto } from './dto/sigin-auth.dto';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() SignupAuthDto: SignupAuthDto) {
    return this.authService.signup(SignupAuthDto);
  }

  @Post('signin')
  signin(@Body() SigninAuthDto:SigninAuthDto ) {
    return this.authService.signin(SigninAuthDto);
  }

}
