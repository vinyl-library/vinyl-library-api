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
    const loginRequestDto: LoginRequestDto = {
      username: 'username',
      password: 'password',
    };

    const mockUser = {
      id: 'id',
      username: 'username',
      password: 'encrypted password',
    };

    it('should return token if credential valid', async () => {
      // setup
      const TOKEN = 'generated token';

      prismaServiceMock.user.findFirst.mockResolvedValue(mockUser);
      jwtServiceMock.sign.mockResolvedValue(TOKEN);

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      // act
      const result = await authService.login(loginRequestDto);

      // assert
      expect(result).toEqual(expect.any(String));
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: { username: loginRequestDto.username },
      });
      expect(bcrypt.compareSync).toBeCalledWith(
        loginRequestDto.password,
        mockUser.password,
      );
      expect(jwtServiceMock.sign).toBeCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
      });
    });

    it('should throw Unauthorized Exception if username not found', async () => {
      // setup
      prismaServiceMock.user.findFirst.mockResolvedValue(null);

      // act and assert
      await expect(authService.login(loginRequestDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: { username: loginRequestDto.username },
      });
    });

    it('should throw Unauthorized Exception if password is invalid', async () => {
      // setup
      prismaServiceMock.user.findFirst.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      // act and assert
      await expect(authService.login(loginRequestDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: { username: loginRequestDto.username },
      });
      expect(bcrypt.compareSync).toBeCalledWith(
        loginRequestDto.password,
        mockUser.password,
      );
    });
  });

  describe('register', () => {
    const registerRequestDto: RegisterRequestDto = {
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
      await authService.register(registerRequestDto);

      // assert
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: {
          username: registerRequestDto.username,
        },
      });
      expect(prismaServiceMock.genre.findMany).toBeCalledWith({
        where: {
          id: { in: registerRequestDto.favoriteGenre },
        },
      });
      expect(bcrypt.hashSync).toBeCalledWith(
        registerRequestDto.password,
        SALT_ROUNDS,
      );
      expect(prismaServiceMock.user.create).toBeCalledWith({
        data: {
          username: registerRequestDto.username,
          name: registerRequestDto.name,
          password: ENCRYPTED_PASSWORD,
          favoriteGenre: {
            connect: registerRequestDto.favoriteGenre.map((id) => {
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
      await expect(authService.register(registerRequestDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: {
          username: registerRequestDto.username,
        },
      });
    });

    it('should throw Bad Request Exception if genre not found', async () => {
      // setup
      prismaServiceMock.user.findFirst.mockResolvedValue(null);
      prismaServiceMock.genre.findMany.mockResolvedValue([]);

      // act and assert
      await expect(authService.register(registerRequestDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaServiceMock.user.findFirst).toBeCalledWith({
        where: {
          username: registerRequestDto.username,
        },
      });
      expect(prismaServiceMock.genre.findMany).toBeCalledWith({
        where: {
          id: { in: registerRequestDto.favoriteGenre },
        },
      });
    });
  });
});
