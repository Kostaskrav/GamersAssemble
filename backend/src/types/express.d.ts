import { JwtPayload } from '../auth/types/jwt-payload.type';

export {};

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}
