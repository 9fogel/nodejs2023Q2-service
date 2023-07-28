import { Injectable } from '@nestjs/common';
import { IUser } from 'src/models/interfaces';
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
}
