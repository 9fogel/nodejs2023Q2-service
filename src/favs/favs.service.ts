import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavsService {
  // constructor(private db: DatabaseService) {}
  constructor(private prisma: PrismaService) {}

  // async create(entity: string, id: string) {
  //   const favDbKey = 'fav' + entity[0].toUpperCase() + entity.slice(1);
  //   const idKey = `${entity}Id`;
  //   if (this.existsInDatabase(entity, id)) {
  //     return await this.prisma[favDbKey].create({
  //       data: { [idKey]: id },
  //     });
  //   } else {
  //     throw new UnprocessableEntityException(
  //       `Sorry, ${entity} with ID ${id} doesn't exist in Database`,
  //     );
  //   }
  // }

  async create(entity: string, id: string) {
    // const favDbKey = 'fav' + entity[0].toUpperCase() + entity.slice(1);
    // const idKey = `${entity}Id`;
    if (this.existsInDatabase(entity, id)) {
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
      // return await this.prisma[favDbKey].create({
      //   data: { [idKey]: id },
      // });
    } else {
      throw new UnprocessableEntityException(
        `Sorry, ${entity} with ID ${id} doesn't exist in Database`,
      );
    }
  }

  async findAll() {
    const favArtistsIds = (await this.prisma.favArtist.findMany()).map(
      (item) => item.artistId,
    );
    const favTracksIds = (await this.prisma.favTrack.findMany()).map(
      (item) => item.trackId,
    );
    const favAlbumsIds = (await this.prisma.favAlbum.findMany()).map(
      (item) => item.albumId,
    );

    // const [favArtists, favTracks, favAlbums] = await Promise.all([
    //   this.mapIdToItem('artist', favArtistsIds),
    //   this.mapIdToItem('track', favTracksIds),
    //   this.mapIdToItem('album', favAlbumsIds),
    // ]);

    // const artists = favArtists.map((artist) => artist);

    console.log('CONSOLE favs get all');
    // console.log(favArtists);
    // console.log(favTracks);
    // console.log(favAlbums);

    const favArtists = (await this.mapIdToItem('artist', favArtistsIds)).map(
      (item) =>
        item.then((value) => {
          // console.log(value);
          return value;
        }),
    );
    const favTracks = await this.mapIdToItem('track', favTracksIds);
    const favAlbums = await this.mapIdToItem('album', favAlbumsIds);

    console.log(favArtists);

    const result = {
      artists: favArtists,
      albums: [...favAlbums],
      tracks: [...favTracks],
    };
    // console.log(result);
    return result;
    // return {
    //   artists: [...favArtists],
    //   albums: [...favAlbums],
    //   tracks: [...favTracks],
    // };
  }

  async remove(entity: string, id: string) {
    // const favKey = 'fav' + entity[0].toUpperCase() + entity.slice(1);

    if (this.existsInFavorites(entity, id)) {
      // return await this.prisma[favKey].delete({
      //   where: {
      //     artist: id,
      //   },
      // });
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
    // const doesExist = await this.prisma[favKey].findUnique({
    //   where: {
    //     artistId: id,
    //   },
    // });
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

  private async mapIdToItem(entity: string, idList: Array<string>) {
    const result = idList.map(async (artistId: string) => {
      return await this.prisma[entity].findUnique({
        where: {
          id: artistId,
        },
      });
    });

    return result;
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

  // create(entity: string, id: string) {
  //   const isIdValid = uuidValidate(id);

  //   if (!isIdValid) {
  //     throw new BadRequestException(
  //       `Sorry, ${entity} ID ${id} is invalid (not uuid)`,
  //     );
  //   }

  //   const key = entity + 's';
  //   if (this.db.existsInDatabase(key, id)) {
  //     return this.db.addToFavs(key, id);
  //   } else {
  //     throw new UnprocessableEntityException(
  //       `Sorry, ${entity} with ID ${id} doesn't exist in Database`,
  //     );
  //   }
  // }

  // findAll() {
  //   return this.db.findMany('favs');
  // }

  // remove(entity: string, id: string) {
  //   const isIdValid = uuidValidate(id);

  //   if (!isIdValid) {
  //     throw new BadRequestException(
  //       `Sorry, ${entity} ID ${id} is invalid (not uuid)`,
  //     );
  //   }

  //   const key = entity + 's';
  //   if (this.db.existsInFavorites(key, id)) {
  //     this.db.removeFromFavs(key, id);
  //     return `${key.toUpperCase()} with ID ${id} was removed from Favorites`;
  //   } else {
  //     throw new NotFoundException(
  //       `Sorry, ${entity} with ID ${id} not found in Favorites`,
  //     );
  //   }
  // }
}
