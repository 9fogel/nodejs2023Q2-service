import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { IUser } from 'src/models/interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  create(createUserDto: CreateUserDto) {
    const newUser = {
      id: uuidv4(),
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.db.users.push(newUser);

    const newUserResponse = this.hidePasswordUser(newUser);

    return newUserResponse;
  }

  findAll() {
    return this.db.users.map((user) => this.hidePasswordUser(user));
  }

  findOne(id: string) {
    const foundUser = this.db.users.find((user) => user.id === id);
    return this.hidePasswordUser(foundUser);
  }

  updatePassword(id: string, updateUserDto: UpdateUserDto) {
    const userToUpdate = this.db.users.find((user) => user.id === id);
    const { oldPassword, newPassword } = updateUserDto;

    if (oldPassword === userToUpdate.password) {
      //update is possible
      userToUpdate.password = newPassword;
      userToUpdate.version += 1;
      userToUpdate.updatedAt = Date.now();
    } else {
      console.log('Old password is incorrect, status code 403');
    }

    return this.hidePasswordUser(userToUpdate);
  }

  remove(id: string) {
    const userToDelete = this.db.users.find((user) => user.id === id);
    const userIndexToDelete = this.db.users.indexOf(userToDelete);
    this.db.users.splice(userIndexToDelete, 1);
    return `This action removes a #${id} user`;
  }

  hidePasswordUser(user: IUser) {
    const userResponse = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return userResponse;
  }
}
