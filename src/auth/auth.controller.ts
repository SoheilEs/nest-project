import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() createAuthDto: CreateAuthDto) {
    console.log("===",createAuthDto)
    return this.authService.signin(createAuthDto);
  }

  @Post('signup')
  signup() {
    return this.authService.signup();
  }

}
