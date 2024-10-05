import { Injectable } from '@nestjs/common';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/src/prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CommonResponse } from '../common/models/common.response';
import { validateCatchError } from '../common/lib/utils';
import { FindOneClientDto } from './dto/find-client.dto';
import { CLientAndTickets } from './model/types';

@Injectable()
export class ClientsService {
  private queryOptions: Prisma.ClientFindManyArgs<DefaultArgs>;

  constructor(private readonly prismaService: PrismaService) {}

  async findAll(paginationDto: PaginationDto): Promise<CommonResponse> {
    const { offSet = 10, page = 0, query } = paginationDto;

    this.queryOptions = {
      skip: page * offSet,
      take: offSet,
      where: {
        isActive: true,
      },
      select: {
        id: true,
        ccNumber: true,
        fullName: true,
        balance: true,
        creditLimit: true,
      },
    };

    if (query) {
      this.queryOptions.where = {
        AND: [
          {
            isActive: true,
            OR: [
              {
                fullName: {
                  contains: query,
                },
              },
            ],
          },
        ],
      };
    }

    try {
      const clients = await this.prismaService.client.findMany({
        ...this.queryOptions,
      });

      if (!clients) {
        return {
          statusCode: 204,
          message: 'Clients not found',
        };
      }

      return {
        statusCode: 200,
        message: 'Clients found successfully',
        data: clients,
      };
    } catch (error) {
      return validateCatchError(error);
    }
  }

  async findOne(
    findOneClient: FindOneClientDto,
  ): Promise<CommonResponse<CLientAndTickets>> {
    const { ccNumber, obtainTickets } = findOneClient;

    this.queryOptions = {
      where: {
        ccNumber,
        isActive: true,
      },
    };

    if (obtainTickets) {
      this.queryOptions.include = {
        tickets: {
          where: {
            state: 'PENDING',
            isActive: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      };
    }

    try {
      const client = await this.prismaService.client.findFirst(
        this.queryOptions,
      );

      if (!client) {
        return {
          statusCode: 204,
          message: 'Client not found',
        };
      }

      return {
        statusCode: 200,
        message: 'Client found successfully',
        data: client,
      };
    } catch (error) {
      return validateCatchError(error);
    }
  }
}
