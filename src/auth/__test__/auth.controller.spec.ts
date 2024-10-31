import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn((registerDto: RegisterDto) => {
      return {
        id: 1,
        username: registerDto.username,
        email: registerDto.email,
      };
    }),
    login: jest.fn((loginDto: LoginDto) => {
      if (loginDto.password === 'wrongpassword') {
        throw new Error('Invalid credentials');
      }
      return { accessToken: 'testToken' };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController) as AuthController;
    authService = module.get<AuthService>(AuthService) as AuthService;
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      };

      const result = await authController.register(registerDto);
      expect(result).toHaveProperty('id');
      expect(result.username).toEqual(registerDto.username);
      expect(result.email).toEqual(registerDto.email);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should log in the user', async () => {
      const loginDto: LoginDto = {
        username: 'testuser@example.com',
        password: 'password123',
      };

      const result = await authController.login(loginDto);
      expect(result).toHaveProperty('accessToken');
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error for invalid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'testuser@example.com',
        password: 'wrongpassword',
      };

      await expect(authController.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});
