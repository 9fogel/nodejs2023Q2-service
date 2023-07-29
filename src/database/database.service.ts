import { Injectable } from '@nestjs/common';
import { IArtist, ITrack, IUser } from 'src/models/interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DatabaseService {
  users: Array<IUser> = [
    {
      id: uuidv4(), // uuid v4
      login: '9fogel',
      password: 'password',
      version: 1, // integer number, increments on update
      createdAt: Date.now(), // timestamp of creation
      updatedAt: Date.now(), // timestamp of last update
    },
  ];

  artists: Array<IArtist> = [
    {
      id: uuidv4(), // uuid v4
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

  addElement(entity: string, element: IUser | IArtist | ITrack) {
    this[entity].push(element);
  }

  deleteElement(entity: string, element: IUser | IArtist | ITrack) {
    //TODO: should set track.artistId to null after ARTIST deletion
    //TODO: should set album.artistId to null after ARTIST deletion
    const elemIndexToDelete = this[entity].indexOf(element);
    this[entity].splice(elemIndexToDelete, 1);
  }

  findFirst(entity: string, id: string) {
    return this[entity].find((elem) => elem.id === id);
  }

  findMany(entity: string) {
    return this[entity];
  }
}
