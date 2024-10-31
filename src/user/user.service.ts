import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { readFileSync, writeFileSync } from 'fs-extra';

const USERS_DB = './data/users.json';

@Injectable()
export class UserService {
    private readUsers() {
        return JSON.parse(readFileSync(USERS_DB, 'utf8'));
    }

    private writeUsers(data) {
        writeFileSync(USERS_DB, JSON.stringify(data, null, 2));
    }

    async create(registerDto: RegisterDto) {
        const users = this.readUsers();
        const newUser = { id: Date.now(), ...registerDto };
        users.push(newUser);
        this.writeUsers(users);
        return newUser;
    }

    async findOne(id: string) {
        return this.readUsers().find((user) => user.id === +id);
    }

    async validateUser(loginDto) {
        const users = this.readUsers();
        return users.find(
            (user) => user.username === loginDto.username && user.password === loginDto.password,
        );
    }
}
