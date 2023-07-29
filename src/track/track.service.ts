import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private db: DatabaseService) {}

  create(createTrackDto: CreateTrackDto) {
    const newTrack = {
      id: uuidv4(),
      ...createTrackDto,
    };

    this.db.addElement('tracks', newTrack);

    return newTrack;
  }

  findAll() {
    return this.db.findMany('tracks');
  }

  findOne(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, track ID ${id} is invalid (not uuid)`,
      );
    }

    const foundTrack = this.db.findFirst('tracks', id);
    if (foundTrack) {
      return foundTrack;
    } else {
      throw new NotFoundException(`Sorry, track with ID ${id} not found`);
    }
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, track ID ${id} is invalid (not uuid)`,
      );
    }

    const trackToUpdate = this.db.findFirst('tracks', id);
    if (!trackToUpdate) {
      throw new NotFoundException(`Sorry, track with ID ${id} not found`);
    }

    const { name, artistId, albumId, duration } = updateTrackDto;
    trackToUpdate.name = name;
    trackToUpdate.artistId = artistId;
    trackToUpdate.albumId = albumId;
    trackToUpdate.duration = duration;

    return trackToUpdate;
  }

  remove(id: string) {
    const isIdValid = uuidValidate(id);

    if (!isIdValid) {
      throw new BadRequestException(
        `Sorry, track ID ${id} is invalid (not uuid)`,
      );
    }

    const trackToDelete = this.db.findFirst('tracks', id);
    if (trackToDelete) {
      this.db.deleteElement('tracks', trackToDelete);
      return `Track with ID #${id} was removed`;
    } else {
      throw new NotFoundException(`Sorry, Track with ID ${id} not found`);
    }
  }
}
