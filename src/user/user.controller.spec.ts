import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;

  const userServiceMock = {
    checkAvailable: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compile();

    userController = module.get<UserController>(UserController);
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
