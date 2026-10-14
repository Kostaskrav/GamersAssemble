import {
	ArrayUnique,
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsString,
} from 'class-validator';
import { PostType } from '@prisma/client';

export class CreatePostDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	content: string;

	@IsEnum(PostType)
	type: PostType;

	@IsInt()
	gameId: number;

	@IsArray()
	@ArrayUnique()
	@IsInt({ each: true })
	platformIds: number[];
}