import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async create(entity: string, id: string) {
    if (await this.existsInDatabase(entity, id)) {
      console.log('CONSOLE add ', entity, id);
      switch (entity) {
        case 'album':
          await this.addAlbum(id);
          break;
        case 'artist':
          await this.addArtist(id);
          break;
        case 'track':
          await this.addTrack(id);
          break;
      }
    } else {
      console.log('DOENST EXIST');
      throw new UnprocessableEntityException(
        `Sorry, ${entity} with ID ${id} doesn't exist in Database`,
      );
    }
  }

  async findAll() {
    const favAlbums = await this.prisma.favAlbum.findMany({
      include: {
        album: true,
      },
    });

    const favArtists = await this.prisma.favArtist.findMany({
      include: {
        artist: true,
      },
    });

    const favTracks = await this.prisma.favTrack.findMany({
      include: {
        track: true,
      },
    });

    const result = {
      artists: favArtists.map((item) => item.artist),
      albums: favAlbums.map((item) => item.album),
      tracks: favTracks.map((item) => item.track),
    };

    return result;
  }

  async remove(entity: string, id: string) {
    if (await this.existsInFavorites(entity, id)) {
      console.log('CONSOLE remove ', entity, id);
      switch (entity) {
        case 'album':
          await this.removeAlbum(id);
          break;
        case 'artist':
          await this.removeArtist(id);
          break;
        case 'track':
          await this.removeTrack(id);
          break;
      }
    } else {
      console.log('CONSOLE nor found in FAVS');
      throw new NotFoundException(
        `Sorry, ${entity} with ID ${id} not found in Favorites`,
      );
    }
  }

  private async addAlbum(id: string) {
    await this.prisma.favAlbum.create({
      data: {
        albumId: id,
      },
    });
  }

  private async addArtist(id: string) {
    await this.prisma.favArtist.create({
      data: {
        artistId: id,
      },
    });
  }

  private async addTrack(id: string) {
    await this.prisma.favTrack.create({
      data: {
        trackId: id,
      },
    });
  }

  private async existsInDatabase(entity: string, id: string) {
    const doesExist = await this.prisma[entity].findUnique({
      where: {
        id: id,
      },
    });

    return doesExist ? true : false;
  }

  private async existsInFavorites(entity: string, id: string) {
    let doesExist;
    switch (entity) {
      case 'album':
        doesExist = await this.prisma.favAlbum.findUnique({
          where: {
            albumId: id,
          },
        });
        break;
      case 'artist':
        doesExist = await this.prisma.favArtist.findUnique({
          where: {
            artistId: id,
          },
        });
        break;
      case 'track':
        doesExist = await this.prisma.favTrack.findUnique({
          where: {
            trackId: id,
          },
        });
        break;
    }

    return doesExist ? true : false;
  }

  private async removeAlbum(id: string) {
    await this.prisma.favAlbum.delete({
      where: {
        albumId: id,
      },
    });
  }

  private async removeArtist(id: string) {
    await this.prisma.favArtist.delete({
      where: {
        artistId: id,
      },
    });
  }

  private async removeTrack(id: string) {
    await this.prisma.favTrack.delete({
      where: {
        trackId: id,
      },
    });
  }
}
