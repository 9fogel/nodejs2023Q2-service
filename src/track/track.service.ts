import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate as uuidValidate } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTrackDto) {
    const newTrack = await this.prisma.track.create({
      data,
    });

    return newTrack;
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, track ID ${id} is invalid (not uuid)`,
      );
    }

    const foundTrack = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });
    if (foundTrack) {
      return foundTrack;
    } else {
      throw new NotFoundException(`Sorry, track with ID ${id} not found`);
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, track ID ${id} is invalid (not uuid)`,
      );
    }

    const trackToUpdate = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });
    if (!trackToUpdate) {
      throw new NotFoundException(`Sorry, track with ID ${id} not found`);
    }

    const { name, artistId, albumId, duration } = updateTrackDto;
    trackToUpdate.name = name;
    trackToUpdate.artistId = artistId;
    trackToUpdate.albumId = albumId;
    trackToUpdate.duration = duration;

    const updatedTrack = await this.prisma.track.update({
      where: { id: id },
      data: trackToUpdate,
    });

    return updatedTrack;
  }

  async remove(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, track ID ${id} is invalid (not uuid)`,
      );
    }

    const trackToDelete = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });
    if (trackToDelete) {
      await this.prisma.track.delete({
        where: {
          id: id,
        },
      });
      return `Track with ID #${id} was removed`;
    } else {
      throw new NotFoundException(`Sorry, track with ID ${id} not found`);
    }
  }
}
