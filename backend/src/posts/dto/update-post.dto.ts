import { PostType } from '@prisma/client';
import {
	ArrayUnique,
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class UpdatePostDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	title?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	content?: string;

	@IsOptional()
	@IsEnum(PostType)
	type?: PostType;

	@IsOptional()
	@IsArray()
	@ArrayUnique()
	@IsInt({ each: true })
	platformIds?: number[];
}