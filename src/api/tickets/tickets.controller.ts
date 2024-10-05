import { Controller, Get, Param, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @Get()
  findMany(@Query() paginationDto: PaginationDto) {
    return this.ticketsService.findMany(paginationDto);
  }
}
