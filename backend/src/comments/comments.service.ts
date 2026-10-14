import {
	Injectable,
	NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentQueryDto } from './dto/comment-query.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
	constructor(private readonly prisma: PrismaService) {}

    private async findOwnedComment(id: number, userId: number) {

        const comment = await this.prisma.comment.findUnique({
            where: {
                id,
            },
        });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        if (comment.authorId !== userId) {
            throw new ForbiddenException(
                'You are not allowed to modify this comment',
            );
        }
        return comment;
    
    }

	async create(
		postId: number,
		userId: number,
		createCommentDto: CreateCommentDto,
	) {
		const post = await this.prisma.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) {
			throw new NotFoundException('Post not found');
		}

		return this.prisma.comment.create({
			data: {
				content: createCommentDto.content,
				author: {
					connect: {
						id: userId,
					},
				},
				post: {
					connect: {
						id: postId,
					},
				},
			},
			include: {
				author: {
					select: {
						id: true,
						username: true,
						displayName: true,
					},
				},
			},
		});
	}

    async findAll(postId: number, query: CommentQueryDto) {
        const post = await this.prisma.post.findUnique({
            where: {
                id: postId,
            },
            select: {
                id: true,
            },
        });
    
        if (!post) {
            throw new NotFoundException('Post not found');
        }
    
        const skip = (query.page - 1) * query.limit;
    
        const [comments, total] = await Promise.all([
            this.prisma.comment.findMany({
                where: {
                    postId,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                        },
                    },
                },
                orderBy: [
                    {
                        createdAt: 'asc',
                    },
                    {
                        id: 'asc',
                    },
                ],
                skip,
                take: query.limit,
            }),
    
            this.prisma.comment.count({
                where: {
                    postId,
                },
            }),
        ]);
    
        const totalPages = Math.ceil(total / query.limit);
    
        return {
            data: comments,
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages,
            },
        };
    }

    async update(
        id: number,
        userId: number,
        updateCommentDto: UpdateCommentDto,
    ) {
        await this.findOwnedComment(id, userId);
    
        return this.prisma.comment.update({
            where: {
                id,
            },
            data: {
                content: updateCommentDto.content,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                    },
                },
            },
        });
    }

    async remove(id: number, userId: number) {
        await this.findOwnedComment(id, userId);
    
        return this.prisma.comment.delete({
            where: {
                id,
            },
        });
    }
}