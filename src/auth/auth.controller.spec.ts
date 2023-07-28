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
      const DTO: LoginRequestDto = {
        username: 'username',
        password: 'password',
      };

      const TOKEN = 'generated token';

      const responseMock: Partial<Response> = {
        cookie: jest.fn(),
      };

      const SUCCESS_MESSAGE = {
        message: 'Successfully logged in',
      };

      authServiceMock.login.mockResolvedValue(TOKEN);

      // act
      const result = await authController.login(DTO, responseMock as Response);

      // assert
      expect(result).toEqual(SUCCESS_MESSAGE);
      expect(responseMock.cookie).toHaveBeenCalledWith('jwt', TOKEN, {
        httpOnly: true,
      });
      expect(authServiceMock.login).toHaveBeenCalledWith(DTO);
    });
  });

  describe('register', () => {
    it('should return success message', async () => {
      // setup
      const DTO: RegisterRequestDto = {
        username: 'username',
        name: 'name',
        password: 'password',
        favoriteGenre: ['genre'],
      };

      const SUCCESS_MESSAGE = {
        message: 'Successfully registered',
      };

      // act
      const result = await authController.register(DTO);

      // assert
      expect(result).toEqual(SUCCESS_MESSAGE);
      expect(authServiceMock.register).toHaveBeenCalledWith(DTO);
    });
  });

  describe('logout', () => {
    it('should return success message', async () => {
      // setup
      const responseMock: Partial<Response> = {
        clearCookie: jest.fn(),
      };

      const SUCCESS_MESSAGE = {
        message: 'Successfully logged out',
      };

      // act
      const result = await authController.logout(responseMock as Response);

      // assert
      expect(result).toEqual(SUCCESS_MESSAGE);
      expect(responseMock.clearCookie).toHaveBeenCalledWith('jwt', {
        httpOnly: true,
      });
    });
  });
});
