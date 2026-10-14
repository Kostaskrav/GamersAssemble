import { Prisma } from '@prisma/client';

export const postInclude = {
	author: {
		select: {
			id: true,
			username: true,
			displayName: true,
		},
	},
	game: true,
	platforms: true,
} satisfies Prisma.PostInclude;