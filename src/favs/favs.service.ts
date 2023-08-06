import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class FavsService {
  constructor(private db: DatabaseService) {}

  create(entity: string, id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, ${entity} ID ${id} is invalid (not uuid)`,
      );
    }

    const key = entity + 's';
    if (this.db.existsInDatabase(key, id)) {
      return this.db.addToFavs(key, id);
    } else {
      throw new UnprocessableEntityException(
        `Sorry, ${entity} with ID ${id} doesn't exist in Database`,
      );
    }
  }

  findAll() {
    return this.db.findMany('favs');
  }

  remove(entity: string, id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, ${entity} ID ${id} is invalid (not uuid)`,
      );
    }

    const key = entity + 's';
    if (this.db.existsInFavorites(key, id)) {
      this.db.removeFromFavs(key, id);
      return `${key.toUpperCase()} with ID ${id} was removed from Favorites`;
    } else {
      throw new NotFoundException(
        `Sorry, ${entity} with ID ${id} not found in Favorites`,
      );
    }
  }
}
