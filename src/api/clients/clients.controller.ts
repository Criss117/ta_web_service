import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseBoolPipe,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const res = await this.clientsService.findAll(paginationDto);

    if (res.statusCode === 204) {
      throw new HttpException(res, res.statusCode);
    }

    return res;
  }

  @Get(':ccNumber')
  async findOne(
    @Param('ccNumber') ccNumber: string,
    @Query('obtainTickets') obtainTickets: boolean,
  ) {
    const res = await this.clientsService.findOne({ ccNumber, obtainTickets });

    if (res.statusCode === 204) {
      throw new HttpException(res, res.statusCode);
    }

    return res;
  }
}
