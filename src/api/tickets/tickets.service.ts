import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/src/prisma/prisma.service';
import { CommonResponse } from '../common/models/common.response';
import { Ticket } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CommonPagResponse } from '../common/models/comon-pag.response';

@Injectable()
export class TicketsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<CommonResponse<Ticket | null>> {
    const ticket = await this.prismaService.ticket.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        productSales: {
          include: {
            product: {
              select: {
                description: true,
              },
            },
          },
        },
        client: {
          select: {
            ccNumber: true,
            fullName: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return {
      message: 'Ticket found',
      statusCode: HttpStatus.OK,
      data: ticket,
    };
  }

  async findMany(
    paginationDto: PaginationDto,
  ): Promise<CommonPagResponse<Ticket[] | null>> {
    const { offSet = 10, page = 0 } = paginationDto;

    const totalTickets = await this.prismaService.ticket.count({
      where: {
        isActive: true,
      },
    });

    const tickets = await this.prismaService.ticket.findMany({
      where: {
        isActive: true,
      },
      skip: offSet * page,
      take: offSet,
    });

    if (!tickets) {
      throw new NotFoundException('Tickets not found');
    }

    const nextPage = page + 1 > totalTickets / offSet ? -1 : page + 1;
    const prevPage = page - 1 < 0 ? 0 : page - 1;

    return {
      message: 'Tickets found',
      statusCode: HttpStatus.OK,
      data: {
        items: tickets,
        totalItems: totalTickets,
        totalPages: Math.ceil(totalTickets / offSet),
        nextPage,
        prevPage,
      },
    };
  }
}
