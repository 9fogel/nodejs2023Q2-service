import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Post(':entity/:id')
  async create(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      return await this.favsService.create(entity, id);
    } catch (err) {
      console.log(err.toString());
      return err;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.favsService.findAll();
    } catch (err) {
      console.log(err.toString());
    }
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  async remove(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      return await this.favsService.remove(entity, id);
    } catch (err) {
      console.log(err.toString());
    }
  }
}
