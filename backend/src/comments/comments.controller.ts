import {
	Body,
	Controller,
	Param,
	ParseIntPipe,
	Post,
	Req,
	UseGuards,
    Get,
    Query,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';
import { CommentQueryDto } from './dto/comment-query.dto';

@Controller('posts/:postId/comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(
		@Param('postId', ParseIntPipe) postId: number,
		@Req() request: Request,
		@Body() createCommentDto: CreateCommentDto,
	) {
		const userId = request.user!.sub;

		return this.commentsService.create(
			postId,
			userId,
			createCommentDto,
		);
	}

    @Get()
    findAll(
        @Param('postId', ParseIntPipe) postId: number,
        @Query() query: CommentQueryDto,
    ) {
        return this.commentsService.findAll(postId, query);
    }
}