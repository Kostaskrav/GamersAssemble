import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
            request.user = payload;
		} catch {
			throw new UnauthorizedException();
		}

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const authorization = request.headers.authorization;

		if (!authorization) {
			return undefined;
		}

		const parts = authorization.split(' ');

		if (parts.length !== 2) {
			return undefined;
		}

		const type = parts[0];
		const token = parts[1];

		if (type !== 'Bearer') {
			return undefined;
		}

		return token;
	}
}