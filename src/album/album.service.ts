import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate as uuidValidate } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAlbumDto) {
    const newAlbum = await this.prisma.album.create({
      data,
    });

    return newAlbum;
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, album ID ${id} is invalid (not uuid)`,
      );
    }

    const foundAlbum = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });
    if (foundAlbum) {
      return foundAlbum;
    } else {
      throw new NotFoundException(`Sorry, album with ID ${id} not found`);
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, album ID ${id} is invalid (not uuid)`,
      );
    }

    const albumToUpdate = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });
    if (!albumToUpdate) {
      throw new NotFoundException(`Sorry, album with ID ${id} not found`);
    }

    const { name, year, artistId } = updateAlbumDto;
    albumToUpdate.name = name;
    albumToUpdate.year = year;
    albumToUpdate.artistId = artistId;

    const updatedAlbum = await this.prisma.album.update({
      where: { id: id },
      data: albumToUpdate,
    });

    return updatedAlbum;
  }

  async remove(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, album ID ${id} is invalid (not uuid)`,
      );
    }

    const albumToDelete = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });
    if (albumToDelete) {
      await this.prisma.album.delete({
        where: {
          id: id,
        },
      });
      return `Album with ID #${id} was removed`;
    } else {
      throw new NotFoundException(`Sorry, album with ID ${id} not found`);
    }
  }
}
