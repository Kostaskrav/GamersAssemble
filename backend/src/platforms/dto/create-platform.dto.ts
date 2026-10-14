import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlatformDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}