import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from 'src/models/interfaces';
import { validate as uuidValidate } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const newUser = await this.prisma.user.create({
      data,
    });

    const newUserResponse = this.responseUser(newUser);

    return newUserResponse;
  }

  async findAll() {
    return (await this.prisma.user.findMany()).map((user: IUser) =>
      this.responseUser(user),
    );
  }

  async findOne(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, user ID ${id} is invalid (not uuid)`,
      );
    }

    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (foundUser) {
      return this.responseUser(foundUser);
    } else {
      throw new NotFoundException(`Sorry, user with ID ${id} not found`);
    }
  }

  async updatePassword(id: string, updateUserDto: UpdateUserDto) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, user ID ${id} is invalid (not uuid)`,
      );
    }

    const userToUpdate = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userToUpdate) {
      throw new NotFoundException(`Sorry, user with ID ${id} not found`);
    }

    const { oldPassword, newPassword } = updateUserDto;

    if (oldPassword === userToUpdate.password) {
      userToUpdate.password = newPassword;
      userToUpdate.version += 1;
      userToUpdate.createdAt = userToUpdate.createdAt;
      userToUpdate.updatedAt = new Date(Date.now());
    } else {
      throw new ForbiddenException(`Old password is incorrect`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: userToUpdate,
    });

    return this.responseUser(updatedUser);
  }

  async remove(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, user ID ${id} is invalid (not uuid)`,
      );
    }

    const userToDelete = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (userToDelete) {
      await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      return `User with ID #${id} was removed`;
    } else {
      throw new NotFoundException(`Sorry, user with ID ${id} not found`);
    }
  }

  responseUser(user: IUser) {
    const userResponse = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: (user.createdAt as Date).getTime(),
      updatedAt: (user.updatedAt as Date).getTime(),
    };

    return userResponse;
  }
}
