import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CommonResponse } from '../common/models/common.response';
import { PrismaService } from '@/src/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async health(): Promise<CommonResponse<string>> {
    try {
      const mode = this.configService.get<string>('NODE_ENV', 'dev');
      await this.prismaService.$queryRaw`SELECT 1;`;

      return {
        statusCode: 200,
        message: 'OK',
        data: `All good, work on ${mode} mode`,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
