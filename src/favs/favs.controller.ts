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
    return await this.favsService.create(entity, id);
  }

  @Get()
  async findAll() {
    return await this.favsService.findAll();
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  async remove(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.favsService.remove(entity, id);
  }
}
