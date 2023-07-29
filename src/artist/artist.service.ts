import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class ArtistService {
  constructor(private db: DatabaseService) {}

  create(createArtistDto: CreateArtistDto) {
    const newArtist = {
      id: uuidv4(),
      ...createArtistDto,
    };

    this.db.addElement('artists', newArtist);

    return newArtist;
    // return 'This action adds a new artist';
  }

  findAll() {
    return this.db.findMany('artists');
    // return `This action returns all artist`;
  }

  findOne(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, artist ID ${id} is invalid (not uuid)`,
      );
    }

    const foundArtist = this.db.findFirst('artists', id);
    if (foundArtist) {
      return foundArtist;
    } else {
      throw new NotFoundException(`Sorry, artist with ID ${id} not found`);
    }

    // return `This action returns a #${id} artist`;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, artist ID ${id} is invalid (not uuid)`,
      );
    }

    const artistToUpdate = this.db.findFirst('artists', id);
    if (!artistToUpdate) {
      throw new NotFoundException(`Sorry, artist with ID ${id} not found`);
    }

    const { name, grammy } = updateArtistDto;
    artistToUpdate.name = name;
    artistToUpdate.grammy = grammy;

    return artistToUpdate;
    // return `This action updates a #${id} artist`;
  }

  remove(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, artist ID ${id} is invalid (not uuid)`,
      );
    }

    const artistToDelete = this.db.findFirst('artists', id);
    if (artistToDelete) {
      this.db.deleteElement('artists', artistToDelete);
      return `Artist with ID #${id} was removed`;
    } else {
      throw new NotFoundException(`Sorry, artist with ID ${id} not found`);
    }
  }
}
