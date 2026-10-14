import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    ArrayUnique, 
    IsArray, 
    IsInt
  } from 'class-validator';
  
  export class CreateGameDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    slug: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsDateString()
    releaseDate?: string;
  
    @IsOptional()
    @IsUrl()
    coverImageUrl?: string;
    
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    platformIds: number[];
  }