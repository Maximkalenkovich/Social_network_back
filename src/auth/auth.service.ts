import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto) {
        return this.userService.create(registerDto);
    }

    async login(loginDto: LoginDto) {
        const user = await this.userService.validateUser(loginDto);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
