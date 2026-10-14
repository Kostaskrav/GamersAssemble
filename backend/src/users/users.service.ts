import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email,
			},
		});
	}

	findByUsername(username: string) {
		return this.prisma.user.findUnique({
			where: {
				username,
			},
		});
	}

    findById(id: number) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    findPublicById(id: number) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

	create(
		email: string,
		username: string,
		passwordHash: string,
		displayName?: string,
	) {
		return this.prisma.user.create({
			data: {
				email,
				username,
				passwordHash,
				displayName,
			},
		});
	}
}