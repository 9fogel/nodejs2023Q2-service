import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async create(entity: string, id: string) {
    // try {
    switch (entity) {
      case 'album':
        try {
          await this.addAlbum(id);
        } catch (err) {
          this.handleError(err, entity, id);
        }
        break;
      case 'artist':
        try {
          await this.addArtist(id);
        } catch (err) {
          this.handleError(err, entity, id);
        }
        break;
      case 'track':
        try {
          await this.addTrack(id);
        } catch (err) {
          this.handleError(err, entity, id);
        }
        break;
    }
    return `${entity.toUpperCase()} with ID ${id} was added to favorites`;
    // } catch (err) {
    //   this.handleError(err, entity, id);
    // }
  }

  handleError(err: Error, entity: string, id: string) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          console.log('CONSOLE P2002');
          throw new UnprocessableEntityException(
            `Sorry, ${entity} with ID ${id} already exists in Favorites`,
          );
        case 'P2003':
          console.log('CONSOLE P2003');
          throw new UnprocessableEntityException(
            `Sorry, ${entity} with ID ${id} doesn't exist in Database`,
          );
      }
    } else {
      throw err;
      // console.log(err.toString());
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
      switch (entity) {
        case 'album':
          return await this.removeAlbum(id);
        case 'artist':
          return await this.removeArtist(id);
        case 'track':
          return await this.removeTrack(id);
      }
    } else {
      throw new NotFoundException(
        `Sorry, ${entity} with ID ${id} not found in Favorites`,
      );
    }
  }

  private async addAlbum(id: string) {
    return await this.prisma.favAlbum.create({
      data: {
        albumId: id,
      },
    });
  }

  private async addArtist(id: string) {
    return await this.prisma.favArtist.create({
      data: {
        artistId: id,
      },
    });
  }

  private async addTrack(id: string) {
    return await this.prisma.favTrack.create({
      data: {
        trackId: id,
      },
    });
  }

  // private async existsInDatabase(entity: string, id: string) {
  //   const doesExist = await this.prisma[entity].findUnique({
  //     where: {
  //       id: id,
  //     },
  //   });

  //   return doesExist ? true : false;
  // }

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
    return await this.prisma.favAlbum.delete({
      where: {
        albumId: id,
      },
    });
  }

  private async removeArtist(id: string) {
    return await this.prisma.favArtist.delete({
      where: {
        artistId: id,
      },
    });
  }

  private async removeTrack(id: string) {
    return await this.prisma.favTrack.delete({
      where: {
        trackId: id,
      },
    });
  }
}
