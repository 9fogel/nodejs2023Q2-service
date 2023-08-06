import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Post(':entity/:id')
  create(@Param('entity') entity: string, @Param('id') id: string) {
    this.favsService.create(entity, id);
    return `${entity.toUpperCase()} with ID ${id} was added to favorites`;
    // return { id };
  }

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  remove(@Param('entity') entity: string, @Param('id') id: string) {
    return this.favsService.remove(entity, id);
  }
}
