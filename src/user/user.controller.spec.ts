import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Request } from 'express';

describe('UserController', () => {
  let userController: UserController;

  const userServiceMock = {
    getUser: jest.fn(),
    checkAvailable: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('get user', () => {
    it('should return logged in user', async () => {
      // setup
      const USER = {
        username: 'user1',
      };

      const requestMock: Partial<Request> = {
        user: USER,
      };

      const RESOLVED_USER = {
        username: 'user1',
        name: 'User 1',
        fine: 0,
      };

      userServiceMock.getUser.mockResolvedValue(RESOLVED_USER);

      const SUCCESS_MESSAGE = {
        message: 'Successfully get user',
      };

      // act
      const result = await userController.getUser(requestMock as Request);

      // assert
      expect(result).toEqual({ ...SUCCESS_MESSAGE, data: RESOLVED_USER });
      expect(userServiceMock.getUser).toBeCalledWith(USER.username);
    });
  });

  describe('check available', () => {
    const USERNAME = 'username';

    it('should return status true if username available', async () => {
      // setup
      const MESSAGE = {
        message: 'Username available',
      };

      userServiceMock.checkAvailable.mockResolvedValue(true);

      // act
      const result = await userController.checkAvailable(USERNAME);

      // assert
      expect(result).toEqual({ ...MESSAGE, data: { status: true } });
      expect(userServiceMock.checkAvailable).toBeCalledWith(USERNAME);
    });

    it('should return status false if username not available', async () => {
      // setup
      const MESSAGE = {
        message: 'Username unavailable',
      };

      userServiceMock.checkAvailable.mockResolvedValue(false);

      // act
      const result = await userController.checkAvailable(USERNAME);

      // assert
      expect(result).toEqual({ ...MESSAGE, data: { status: false } });
      expect(userServiceMock.checkAvailable).toBeCalledWith(USERNAME);
    });
  });
});
