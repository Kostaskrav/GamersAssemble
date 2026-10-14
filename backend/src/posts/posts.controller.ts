import {
	Body,
	Controller,
	Post,
	Req,
	UseGuards,
    Get,
    Param,
    Patch,
	ParseIntPipe,
    Query,
    Delete
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { PostQueryDto } from './dto/post-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(
		@Req() request: Request,
		@Body() createPostDto: CreatePostDto,
	) {
		const userId = request.user!.sub;

		return this.postsService.create(userId, createPostDto);
	}
    
    @Get()
    findAll(@Query() query: PostQueryDto) {
        return this.postsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        const userId = request.user!.sub;

        return this.postsService.update(id, userId, updatePostDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
    ) {
        const userId = request.user!.sub;

        return this.postsService.remove(id, userId);
    }
}