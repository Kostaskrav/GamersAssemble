import {
	Body,
	Controller,
	Delete,
	Param,
	ParseIntPipe,
	Patch,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CommentsService } from '../comments.service';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Controller('comments')
export class CommentManagementController {
	constructor(private readonly commentsService: CommentsService) {}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	update(
		@Param('id', ParseIntPipe) id: number,
		@Req() request: Request,
		@Body() updateCommentDto: UpdateCommentDto,
	) {
		const userId = request.user!.sub;

		return this.commentsService.update(
			id,
			userId,
			updateCommentDto,
		);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	remove(
		@Param('id', ParseIntPipe) id: number,
		@Req() request: Request,
	) {
		const userId = request.user!.sub;

		return this.commentsService.remove(id, userId);
	}
}