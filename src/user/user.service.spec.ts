import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UserService', () => {
  let userService: UserService;

  const prismaServiceMock = {
    user: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('check available', () => {
    it('should return true if username available', async () => {
      // setup
      prismaServiceMock.user.findFirst.mockResolvedValue(null);

      // act
      const result = await userService.checkAvailable('username');

      // assert
      expect(result).toEqual(true);
    });

    it('should return false if username unavailable', async () => {
      // setup
      prismaServiceMock.user.findFirst.mockResolvedValue({
        id: 'user1',
        username: 'user1',
        name: 'User 1',
      });

      // act
      const result = await userService.checkAvailable('username');

      // assert
      expect(result).toEqual(false);
    });
  });
});
