import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn((dto: RegisterDto) => Promise.resolve({ id: 1, ...dto })),
    findByEmail: jest.fn((email: string) => Promise.resolve(null)), // Заглушка для поиска
    validateUser: jest.fn((username: string, password: string) => {
      // Имитация успешной валидации пользователя
      if (username === 'testuser@example.com' && password === 'password123') {
        return Promise.resolve({ id: 1, username });
      }
      return Promise.resolve(null); // Возвращает null для невалидных данных
    }),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'someGeneratedToken'), // Заглушка для JwtService, возвращающая токен
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService) as AuthService;
    userService = module.get<UserService>(UserService) as UserService;
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      };

      const result = await authService.register(registerDto);
      expect(result).toHaveProperty('id');
      expect(result.username).toEqual(registerDto.username);
      expect(mockUserService.create).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should log in a user and return a token', async () => {
      const loginDto: LoginDto = {
        username: 'testuser@example.com',
        password: 'password123',
      };

      const result = await authService.login(loginDto);

      // Проверьте, что токен возвращается с правильным именем свойства
      expect(result).toHaveProperty('access_token'); // Изменено с accessToken на access_token
      expect(result.access_token).toEqual('someGeneratedToken'); // Проверка значения токена
      expect(mockJwtService.sign).toHaveBeenCalledWith({ username: 'testuser@example.com', sub: 1 }); // Исправлено на правильные параметры
    });

    it('should throw an error if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        username: 'invaliduser@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
