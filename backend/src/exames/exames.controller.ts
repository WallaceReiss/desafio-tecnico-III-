import { Controller, Get, Post, Body, Param, Query, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ExamesService } from './exames.service';
import { CreateExameDto } from './dto/create-exame.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('exames')
export class ExamesController {
  constructor(private readonly examesService: ExamesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExameDto: CreateExameDto) {
    return this.examesService.create(createExameDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.examesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.examesService.remove(id);
  }
}
