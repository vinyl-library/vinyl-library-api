import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/LoginRequest.dto';
import { Response } from 'express';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';

describe('AuthController', () => {
  let authController: AuthController;

  const authServiceMock = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should set JWT cookie and return success message', async () => {
      // setup
      const loginRequestDto: LoginRequestDto = {
        username: 'username',
        password: 'password',
      };

      const TOKEN = 'generated token';

      const responseMock: Partial<Response> = {
        cookie: jest.fn(),
      };

      const successMessage = {
        message: 'Successfully logged in',
      };

      authServiceMock.login.mockResolvedValue(TOKEN);

      // act
      const result = await authController.login(
        loginRequestDto,
        responseMock as Response,
      );

      // assert
      expect(result).toEqual(successMessage);
      expect(responseMock.cookie).toHaveBeenCalledWith('jwt', TOKEN, {
        httpOnly: true,
      });
      expect(authServiceMock.login).toHaveBeenCalledWith(loginRequestDto);
    });
  });

  describe('register', () => {
    it('should return success message', async () => {
      // setup
      const registerRequestDto: RegisterRequestDto = {
        username: 'username',
        name: 'name',
        password: 'password',
        favoriteGenre: ['genre'],
      };

      const successMessage = {
        message: 'Successfully registered',
      };

      // act
      const result = await authController.register(registerRequestDto);

      // assert
      expect(result).toEqual(successMessage);
      expect(authServiceMock.register).toHaveBeenCalledWith(registerRequestDto);
    });
  });

  describe('logout', () => {
    it('should return success message', async () => {
      // setup
      const responseMock: Partial<Response> = {
        clearCookie: jest.fn(),
      };

      const successMessage = {
        message: 'Successfully logged out',
      };

      // act
      const result = await authController.logout(responseMock as Response);

      // assert
      expect(result).toEqual(successMessage);
      expect(responseMock.clearCookie).toHaveBeenCalledWith('jwt', {
        httpOnly: true,
      });
    });
  });
});
