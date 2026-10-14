import { PostType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsEnum,
	IsInt,
	IsOptional,
	Max,
	Min,
} from 'class-validator';

export class PostQueryDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	gameId?: number;

	@IsOptional()
	@IsEnum(PostType)
	type?: PostType;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	platformId?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	limit: number = 20;
}