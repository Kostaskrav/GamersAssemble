import { BadRequestException, Injectable , NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GamesService {
    constructor(private readonly prisma: PrismaService) {}

    private async validatePlatformIds(platformIds: number[]) {
        const platforms = await this.prisma.platform.findMany({
            where: {
                id: {
                    in: platformIds,
                },
            },
        });
    
        if (platforms.length !== platformIds.length) {
            throw new BadRequestException(
                'One or more platform IDs do not exist',
            );
        }
    }

    async create(createGameDto: CreateGameDto) {
        const {
            platformIds,
            releaseDate,
            ...gameData
        } = createGameDto;

        await this.validatePlatformIds(createGameDto.platformIds);
        
        return this.prisma.game.create({
            data: {
                ...gameData,
                releaseDate: releaseDate
                ? new Date(releaseDate)
                : undefined,
        
                platforms: {
                connect: platformIds.map((id) => ({ id })),
                },
            },
            include: {
                platforms: true,
            },
        });
    }

    async findOne(id: number) {
        const game = await this.prisma.game.findUnique({
            where: {
                id,
            },
            include: {
                platforms: true,
            },
        });
        
        if (!game) {
            throw new NotFoundException(`Game with ID ${id} not found`);
        }
        
        return game;
    }

    findAll() {
        return this.prisma.game.findMany({
            include: {
                platforms: true,
            },
        });
    }

    async update(id: number, updateGameDto: UpdateGameDto) {
        await this.findOne(id);
    
        const {
            platformIds,
            releaseDate,
            ...gameData
        } = updateGameDto;
    
        if (platformIds !== undefined) {
            await this.validatePlatformIds(platformIds);
        }
    
        const data: Prisma.GameUpdateInput = {
            ...gameData,
        };
    
        if (releaseDate !== undefined) {
            data.releaseDate = new Date(releaseDate);
        }
    
        if (platformIds !== undefined) {
            const platforms = platformIds.map((id) => {
                return { id };
            });
    
            data.platforms = {
                set: platforms,
            };
        }
    
        return this.prisma.game.update({
            where: {
                id,
            },
            data,
            include: {
                platforms: true,
            },
        });
    }
    
    async remove(id: number) {
        await this.findOne(id);
    
        return this.prisma.game.delete({
            where: {
                id,
            },
        });
    }
}
