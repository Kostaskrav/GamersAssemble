import {
	BadRequestException,
	Injectable,
	NotFoundException,
    ForbiddenException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Prisma } from '@prisma/client';
import { PostQueryDto } from './dto/post-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { postInclude } from './constants/post-include';

@Injectable()
export class PostsService {
	constructor(private readonly prisma: PrismaService) {}

    private async findOwnedPost(id: number, userId: number) {
        const post = await this.prisma.post.findUnique({
            where: {
                id,
            },
        });
    
        if (!post) {
            throw new NotFoundException('Post not found');
        }
    
        if (post.authorId !== userId) {
            throw new ForbiddenException(
                'You are not allowed to modify this post',
            );
        }
    
        return post;
    }

    private async validateGamePlatforms(
        gameId: number,
        platformIds: number[],
    ) {
        const game = await this.prisma.game.findUnique({
            where: {
                id: gameId,
            },
            include: {
                platforms: true,
            },
        });
    
        if (!game) {
            throw new NotFoundException('Game not found');
        }
    
        const gamePlatformIds = game.platforms.map((platform) => {
            return platform.id;
        });
    
        const hasInvalidPlatform = platformIds.some((platformId) => {
            return !gamePlatformIds.includes(platformId);
        });
    
        if (hasInvalidPlatform) {
            throw new BadRequestException(
                'One or more selected platforms are not supported by this game',
            );
        }
    }

	async create(userId: number, createPostDto: CreatePostDto) {

        await this.validateGamePlatforms(
            createPostDto.gameId,
            createPostDto.platformIds,
        );

        const platformConnections = createPostDto.platformIds.map((platformId) => {
            return {
                id: platformId,
            };
        });

        const post = await this.prisma.post.create({
            data: {
                title: createPostDto.title,
                content: createPostDto.content,
                type: createPostDto.type,
                author: {
                    connect: {
                        id: userId,
                    },
                },
                game: {
                    connect: {
                        id: createPostDto.gameId,
                    },
                },
                platforms: {
                    connect: platformConnections,
                },
            },
            include: postInclude,
        });
        return post;
    }

    async findAll(query: PostQueryDto) {
        const where: Prisma.PostWhereInput = {};
    
        if (query.gameId !== undefined) {
            where.gameId = query.gameId;
        }
    
        if (query.type !== undefined) {
            where.type = query.type;
        }
    
        if (query.platformId !== undefined) {
            where.platforms = {
                some: {
                    id: query.platformId,
                },
            };
        }

        const skip = (query.page - 1) * query.limit;

        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                include: postInclude,
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: query.limit,
            }),
        
            this.prisma.post.count({
                where,
            }),
        ]);
       
        const totalPages = Math.ceil(total / query.limit);
    
        return {
            data: posts,
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages,
            },
        };
    }

    async findOne(id: number) {
        const post = await this.prisma.post.findUnique({
            where: {
                id,
            },
            include: postInclude,
        });
    
        if (!post) {
            throw new NotFoundException('Post not found');
        }
    
        return post;
    }

    async update(
        id: number,
        userId: number,
        updatePostDto: UpdatePostDto,
    ) {
        const post = await this.findOwnedPost(id, userId);
        
        const {
            platformIds,
            ...postData
        } = updatePostDto;
    
        const data: Prisma.PostUpdateInput = postData;
    
        if (platformIds !== undefined) {
            
            await this.validateGamePlatforms(

                post.gameId,
                platformIds,
            );

            const platformConnections = platformIds.map((platformId) => {
                return {
                    id: platformId,
                };
            });
    
            data.platforms = {
                set: platformConnections,
            };
        }
    
        return this.prisma.post.update({
            where: {
                id,
            },
            data,
            include: postInclude,
        });
    }

    async remove(id: number, userId: number) {
        await this.findOwnedPost(id, userId);

        return this.prisma.post.delete({
            where: {
                id,
            },
        });
    }
}