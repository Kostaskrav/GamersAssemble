import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlatformDto } from './dto/create-platform.dto';

@Injectable()
export class PlatformsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.platform.findMany();
  }

  create(createPlatformDto: CreatePlatformDto) {
    return this.prisma.platform.create({
      data: createPlatformDto,
    });
  }
}