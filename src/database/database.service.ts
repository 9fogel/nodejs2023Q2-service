import { Injectable } from '@nestjs/common';
import {
  IAlbum,
  IArtist,
  IFavorites,
  IFavoritesResponse,
  ITrack,
  IUser,
} from 'src/models/interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DatabaseService {
  users: Array<IUser> = [
    {
      id: uuidv4(),
      login: '9fogel',
      password: 'password',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  artists: Array<IArtist> = [
    {
      id: uuidv4(),
      name: 'Evanescense',
      grammy: true,
    },
  ];

  tracks: Array<ITrack> = [
    {
      id: uuidv4(),
      name: 'Bring Me To Life',
      artistId: this.artists[0].id,
      albumId: null,
      duration: 3,
    },
  ];

  albums: Array<IAlbum> = [
    {
      id: uuidv4(),
      name: 'Fallen',
      year: 2003,
      artistId: this.artists[0].id,
    },
  ];

  favs: IFavorites = {
    artists: [this.artists[0].id],
    albums: [this.albums[0].id],
    tracks: [this.tracks[0].id],
  };

  addElement(entity: string, element: IUser | IArtist | ITrack | IAlbum) {
    this[entity].push(element);
  }

  addToFavs(entity: string, id: string) {
    if (!this.favs[entity].includes(id)) {
      this.favs[entity].push(id);
    }
  }

  deleteElement(entity: string, element: IUser | IArtist | ITrack | IAlbum) {
    const elemIndexToDelete = this[entity].indexOf(element);
    this[entity].splice(elemIndexToDelete, 1);

    const { id } = element;
    if (entity === 'artists') {
      this.tracks
        .filter((track) => track.artistId === id)
        .forEach((track) => (track.artistId = null));
      this.albums
        .filter((album) => album.artistId === id)
        .forEach((album) => (album.artistId = null));
    }

    if (entity === 'albums') {
      this.tracks
        .filter((track) => track.albumId === id)
        .forEach((track) => (track.albumId = null));
    }

    if (
      (entity === 'artists' || entity === 'albums' || entity === 'tracks') &&
      this.existsInDatabase(entity, id)
    ) {
      this.removeFromFavs(entity, id);
    }
  }

  existsInDatabase(entity: string, id: string) {
    const doesExist = this[entity].some(
      (elem: IUser | IArtist | ITrack | IAlbum) => elem.id === id,
    );
    return doesExist;
  }

  existsInFavorites(entity: string, id: string) {
    const doesExist = this.favs[entity].includes(id);
    return doesExist;
  }

  findFirst(entity: string, id: string) {
    return this[entity].find(
      (elem: IUser | IArtist | ITrack | IAlbum) => elem.id === id,
    );
  }

  findMany(entity: string) {
    if (entity === 'favs') {
      const response = {};
      for (const key in this.favs) {
        response[key] = this.favs[key]
          .map((id: string) =>
            this[key].filter(
              (elem: IUser | IArtist | ITrack | IAlbum) => elem.id === id,
            ),
          )
          .flat();
      }

      return response;
    }
    return this[entity];
  }

  removeFromFavs(entity: string, id: string) {
    const idIndexToDelete = this.favs[entity].indexOf(id);
    this.favs[entity].splice(idIndexToDelete, 1);
  }
}
