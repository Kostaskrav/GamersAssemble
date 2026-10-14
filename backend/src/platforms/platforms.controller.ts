import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { CreatePlatformDto } from './dto/create-platform.dto';

@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Get()
  findAll() {
    return this.platformsService.findAll();
  }

  @Post()
  create(@Body() createPlatformDto: CreatePlatformDto) {
    return this.platformsService.create(createPlatformDto);
  }
}