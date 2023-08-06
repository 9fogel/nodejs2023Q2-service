import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class AlbumService {
  constructor(private db: DatabaseService) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = {
      id: uuidv4(),
      ...createAlbumDto,
    };

    this.db.addElement('albums', newAlbum);

    return newAlbum;
  }

  findAll() {
    return this.db.findMany('albums');
  }

  findOne(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, album ID ${id} is invalid (not uuid)`,
      );
    }

    const foundAlbum = this.db.findFirst('albums', id);
    if (foundAlbum) {
      return foundAlbum;
    } else {
      throw new NotFoundException(`Sorry, album with ID ${id} not found`);
    }
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, album ID ${id} is invalid (not uuid)`,
      );
    }

    const albumToUpdate = this.db.findFirst('albums', id);
    if (!albumToUpdate) {
      throw new NotFoundException(`Sorry, album with ID ${id} not found`);
    }

    const { name, year, artistId } = updateAlbumDto;
    albumToUpdate.name = name;
    albumToUpdate.year = year;
    albumToUpdate.artistId = artistId;

    return albumToUpdate;
  }

  remove(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, album ID ${id} is invalid (not uuid)`,
      );
    }

    const albumToDelete = this.db.findFirst('albums', id);
    if (albumToDelete) {
      this.db.deleteElement('albums', albumToDelete);
      return `Album with ID #${id} was removed`;
    } else {
      throw new NotFoundException(`Sorry, album with ID ${id} not found`);
    }
  }
}
