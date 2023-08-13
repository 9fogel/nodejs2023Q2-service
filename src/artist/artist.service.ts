import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateArtistDto) {
    const newArtist = await this.prisma.artist.create({
      data,
    });

    return newArtist;
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const foundArtist = await this.prisma.artist.findUnique({
      where: {
        id: id,
      },
    });
    if (foundArtist) {
      return foundArtist;
    } else {
      throw new NotFoundException(`Sorry, artist with ID ${id} not found`);
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artistToUpdate = await this.prisma.artist.findUnique({
      where: {
        id: id,
      },
    });
    if (!artistToUpdate) {
      throw new NotFoundException(`Sorry, artist with ID ${id} not found`);
    }

    const { name, grammy } = updateArtistDto;
    artistToUpdate.name = name;
    artistToUpdate.grammy = grammy;

    const updatedArtist = await this.prisma.artist.update({
      where: { id: id },
      data: artistToUpdate,
    });

    return updatedArtist;
  }

  async remove(id: string) {
    const artistToDelete = await this.prisma.artist.findUnique({
      where: {
        id: id,
      },
    });
    if (artistToDelete) {
      await this.prisma.artist.delete({
        where: {
          id: id,
        },
      });
      return `Artist with ID #${id} was removed`;
    } else {
      throw new NotFoundException(`Sorry, artist with ID ${id} not found`);
    }
  }
}
