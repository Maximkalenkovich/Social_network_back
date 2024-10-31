import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/guards/jwt.strategy';
import {ConfigModule} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";

@Module({
    imports: [
        ConfigModule.forRoot(), // Подключаем ConfigModule
        PassportModule,
        JwtModule.register({
            secret:  'defaultSecretKey',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule {}
