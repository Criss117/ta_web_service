import { join } from 'path';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { PrismaService } from '@/src/prisma/prisma.service';
import { CommonResponse } from '../common/models/common.response';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<CommonResponse> {
    const mode = this.configService.get<string>('NODE_ENV', 'null');

    if (mode !== 'dev') {
      throw new BadRequestException('Not allowed in production mode');
    }

    this.logger.log('Seeding...');

    const filePath = join(
      process.cwd(),
      'src',
      'api',
      'seed',
      'data',
      'data.json',
    );

    try {
      const fileContents = readFileSync(filePath, 'utf8');
      const items = JSON.parse(fileContents);

      await this.prismaService.$transaction(async (tx) => {
        await tx.syncRemote.deleteMany();

        await tx.debtPayment.deleteMany();

        await tx.productSale.deleteMany();

        await tx.ticket.deleteMany();

        await tx.product.deleteMany().then(async () => {
          await tx.product.createMany({ data: items.products });
        });

        await tx.client.deleteMany().then(async () => {
          await tx.client.createMany({ data: items.clients });
          // await tx.ticket.createMany({ data: items.tickets });
          // await tx.productSale.createMany({ data: items.productSale });
          // await tx.debtPayment.createMany({ data: items.debtPayment });
        });
      });
      this.logger.log('Completed');

      return {
        statusCode: 200,
        message: 'This action adds a new seed',
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error in seed');
    }
  }
}
