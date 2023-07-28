import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginRequestDto } from './dto/LoginRequest.dto';
import bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const prismaServiceMock = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    genre: {
      findMany: jest.fn(),
    },
  };
  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    const DTO: LoginRequestDto = {
      username: 'username',
      password: 'password',
    };

    const MOCK_USER = {
      id: 'id',
      username: 'username',
      password: 'encrypted password',
    };

    it('should return token if credential valid', async () => {
      // setup
      const TOKEN = 'generated token';

      prismaServiceMock.user.findFirst.mockResolvedValue(MOCK_USER);
      jwtServiceMock.sign.mockResolvedValue(TOKEN);

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      // act
      const result = await authService.login(DTO);

      // assert
      expect(result).toEqual(expect.any(String));
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: { username: DTO.username },
      });
      expect(bcrypt.compareSync).toBeCalledWith(
        DTO.password,
        MOCK_USER.password,
      );
      expect(jwtServiceMock.sign).toBeCalledWith({
        sub: MOCK_USER.id,
        username: MOCK_USER.username,
      });
    });

    it('should throw Unauthorized Exception if username not found', async () => {
      // setup
      prismaServiceMock.user.findFirst.mockResolvedValue(null);

      // act and assert
      await expect(authService.login(DTO)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: { username: DTO.username },
      });
    });

    it('should throw Unauthorized Exception if password is invalid', async () => {
      // setup
      prismaServiceMock.user.findFirst.mockResolvedValue(MOCK_USER);

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      // act and assert
      await expect(authService.login(DTO)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: { username: DTO.username },
      });
      expect(bcrypt.compareSync).toBeCalledWith(
        DTO.password,
        MOCK_USER.password,
      );
    });
  });

  describe('register', () => {
    const DTO: RegisterRequestDto = {
      username: 'username',
      name: 'name',
      password: 'password',
      favoriteGenre: ['genre'],
    };

    it('should create new user if success', async () => {
      // setup
      const SALT_ROUNDS = 10;
      const ENCRYPTED_PASSWORD = 'encrypted password';

      prismaServiceMock.user.findFirst.mockResolvedValue(null);
      prismaServiceMock.genre.findMany.mockResolvedValue([{ id: 'genre' }]);

      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(ENCRYPTED_PASSWORD);

      // act
      await authService.register(DTO);

      // assert
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: {
          username: DTO.username,
        },
      });
      expect(prismaServiceMock.genre.findMany).toBeCalledWith({
        where: {
          id: { in: DTO.favoriteGenre },
        },
      });
      expect(bcrypt.hashSync).toBeCalledWith(DTO.password, SALT_ROUNDS);
      expect(prismaServiceMock.user.create).toBeCalledWith({
        data: {
          username: DTO.username,
          name: DTO.name,
          password: ENCRYPTED_PASSWORD,
          favoriteGenre: {
            connect: DTO.favoriteGenre.map((id) => {
              return { id };
            }),
          },
        },
      });
    });

    it('should throw Bad Request Exception if username already exists', async () => {
      // setup
      prismaServiceMock.user.findFirst.mockResolvedValue({
        id: 'id',
        username: 'username',
      });

      // act and assert
      await expect(authService.register(DTO)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: {
          username: DTO.username,
        },
      });
    });

    it('should throw Bad Request Exception if genre not found', async () => {
      // setup
      prismaServiceMock.user.findFirst.mockResolvedValue(null);
      prismaServiceMock.genre.findMany.mockResolvedValue([]);

      // act and assert
      await expect(authService.register(DTO)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: {
          username: DTO.username,
        },
      });
      expect(prismaServiceMock.genre.findMany).toBeCalledWith({
        where: {
          id: { in: DTO.favoriteGenre },
        },
      });
    });
  });
});
