import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path if needed
import * as argon2 from 'argon2';
import { SignupAuthDto } from './dto/signup-auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    // Mock PrismaService
    const prismaServiceMock = {
      user: {
        create: jest.fn(),
      },
    };

    // Mock AuthService
    const authServiceMock = {
      signin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('signin', () => {
    it('should return a user object with hashed password', async () => {
      const signinDto: SignupAuthDto = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const hashedPassword = '$argon2id$v=19$m=65536,t=3,p=4$04584dnmMzlFeoN1xOPwPA$r2GzvbHYUUiFEl/TzOWANoTZpDG5TDCyvLmF3qEsiTM'; // Mock hashed password
      const mockUser = {
        id: 1,
        firstName: signinDto.firstname,
        lastname: signinDto.lastname,
        email: signinDto.email,
        hash: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Spy on argon2.hash to ensure it's being called with the correct password
      const hashSpy = jest.spyOn(argon2, 'hash').mockResolvedValue(hashedPassword);

      // Mock the AuthService's signin method to return the mockUser
      const signinSpy = jest.spyOn(authService, 'signin').mockResolvedValue(mockUser);

      // Call the controller method
      const result = await authController.signin(signinDto);

      // Assert that the result is correct
      expect(result).toEqual(mockUser);

      // Ensure argon2.hash is called with the correct password
      expect(hashSpy).toHaveBeenCalledWith(signinDto.password);

      // Ensure the signin method of AuthService is called with the correct dto
      expect(signinSpy).toHaveBeenCalledWith(signinDto);
    });
  });
});
