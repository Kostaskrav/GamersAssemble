import {
	ConflictException,
	Injectable,
    UnauthorizedException
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
	constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

	async register(registerDto: RegisterDto) {
		const existingEmail = await this.usersService.findByEmail(
			registerDto.email,
		);

		if (existingEmail) {
			throw new ConflictException('Email is already registered');
		}

		const existingUsername = await this.usersService.findByUsername(
			registerDto.username,
		);

		if (existingUsername) {
			throw new ConflictException('Username is already taken');
		}

		const passwordHash = await argon2.hash(registerDto.password);

        const user = await this.usersService.create(
            registerDto.email,
            registerDto.username,
            passwordHash,
            registerDto.displayName,
        );

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            createdAt: user.createdAt,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
    
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
    
        const passwordMatches = await argon2.verify(
            user.passwordHash,
            loginDto.password,
        );
        
        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid email or password');
        }
        
        const payload:JwtPayload = {
            sub: user.id,
        };
        
        const accessToken = await this.jwtService.signAsync(payload);
        
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
            },
        };
        
    }

    async getMe(userId: number) {
        const user = await this.usersService.findPublicById(userId);

        if (!user) {
            throw new UnauthorizedException();
        }
        
        return user;   
    }
}