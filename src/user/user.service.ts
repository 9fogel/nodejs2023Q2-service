import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { IUser } from 'src/models/interfaces';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

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

    this.db.addElement('users', newUser);

    const newUserResponse = this.hidePasswordUser(newUser);

    return newUserResponse;
  }

  findAll() {
    return this.db
      .findMany('users')
      .map((user: IUser) => this.hidePasswordUser(user));
  }

  findOne(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, user ID ${id} is invalid (not uuid)`,
      );
    }

    const foundUser = this.db.findFirst('users', id);
    if (foundUser) {
      return this.hidePasswordUser(foundUser);
    } else {
      throw new NotFoundException(`Sorry, user with ID ${id} not found`);
    }
  }

  updatePassword(id: string, updateUserDto: UpdateUserDto) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, user ID ${id} is invalid (not uuid)`,
      );
    }

    const userToUpdate = this.db.findFirst('users', id);
    if (!userToUpdate) {
      throw new NotFoundException(`Sorry, user with ID ${id} not found`);
    }

    const { oldPassword, newPassword } = updateUserDto;

    if (oldPassword === userToUpdate.password) {
      userToUpdate.password = newPassword;
      userToUpdate.version += 1;
      userToUpdate.updatedAt = Date.now();
    } else {
      throw new ForbiddenException(`Old password is incorrect`);
    }

    return this.hidePasswordUser(userToUpdate);
  }

  remove(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, user ID ${id} is invalid (not uuid)`,
      );
    }

    const userToDelete = this.db.findFirst('users', id);
    if (userToDelete) {
      this.db.deleteElement('users', userToDelete);
      return `User with ID #${id} was removed`;
    } else {
      throw new NotFoundException(`Sorry, user with ID ${id} not found`);
    }
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
