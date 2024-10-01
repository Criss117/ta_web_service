import { Injectable } from '@nestjs/common';
import { SyncRemoteDto } from './dto/sync-remote.dto';
import {
  SyncClient,
  SyncDebtPayment,
  SyncProduct,
  SyncProductSale,
  SyncTicket,
} from './models/types';
import { PrismaService } from '@/src/prisma/prisma.service';

@Injectable()
export class SyncRemoteService {
  constructor(private readonly prismaService: PrismaService) {}
  synchronize(syncRemoteDto: SyncRemoteDto) {
    const syncClient = this.synchronizeClients(syncRemoteDto.Client);
    const syncProduct = this.synchronizeProducts(syncRemoteDto.Product);
    const syncProductSale = this.synchronizeProductSale(
      syncRemoteDto.ProductSale,
    );
    const syncTicket = this.synchronizeTicket(syncRemoteDto.Ticket);
    const syncDebtPayment = this.synchronizeDebtPayment(
      syncRemoteDto.DebtPayment,
    );

    return Promise.all([
      syncClient,
      syncProduct,
      syncProductSale,
      syncTicket,
      syncDebtPayment,
    ]);
  }

  synchronizeClients(syncClient: SyncClient) {
    const { toCreateOrUpdate, toDelete } = syncClient;

    const createPromises = toCreateOrUpdate.map(async (client) => {
      const existClient = await this.prismaService.client.findFirst({
        where: {
          ccNumber: client.ccNumber,
          id: client.id,
        },
      });

      if (existClient) {
        return this.prismaService.client.update({
          where: {
            id: client.id,
          },
          data: client,
        });
      }

      const { id, ...rest } = client;

      return this.prismaService.client.create({
        data: rest,
      });
    });

    const deletePromises = toDelete.map(async (id) => {
      const existClient = await this.prismaService.client.findFirst({
        where: {
          id,
        },
      });

      if (existClient) {
        return this.prismaService.client.update({
          where: {
            id,
          },
          data: {
            deletedAt: new Date(),
            isActive: false,
          },
        });
      }
    });

    return Promise.all([...createPromises, ...deletePromises]);
  }
  synchronizeProducts(syncProduct: SyncProduct) {
    const { toCreateOrUpdate, toDelete } = syncProduct;

    const createPromises = toCreateOrUpdate.map(async (product) => {
      const existProduct = await this.prismaService.product.findFirst({
        where: {
          id: product.id,
          barcode: product.barcode,
        },
      });

      if (existProduct) {
        return this.prismaService.client.update({
          where: {
            id: product.id,
          },
          data: product,
        });
      }

      const { id, ...rest } = product;

      return this.prismaService.product.create({
        data: rest,
      });
    });

    const deletePromises = toDelete.map(async (id) => {
      const existProduct = await this.prismaService.product.findFirst({
        where: {
          id,
        },
      });

      if (existProduct) {
        return this.prismaService.product.update({
          where: {
            id,
          },
          data: {
            deletedAt: new Date(),
            isActive: false,
          },
        });
      }
    });

    return Promise.all([...createPromises, ...deletePromises]);
  }
  synchronizeTicket(syncTicket: SyncTicket) {
    const { toCreateOrUpdate, toDelete } = syncTicket;

    const createPromises = toCreateOrUpdate.map(async (ticket) => {
      const existTicket = await this.prismaService.ticket.findFirst({
        where: {
          id: ticket.id,
          clientId: ticket.clientId,
        },
      });

      if (existTicket) {
        return this.prismaService.ticket.update({
          where: {
            id: ticket.id,
          },
          data: ticket,
        });
      }

      const { id, ...rest } = ticket;

      return this.prismaService.ticket.create({
        data: rest,
      });
    });

    const deletePromises = toDelete.map(async (id) => {
      const existTicket = await this.prismaService.ticket.findFirst({
        where: {
          id,
        },
      });

      if (existTicket) {
        return this.prismaService.ticket.update({
          where: {
            id,
          },
          data: {
            deletedAt: new Date(),
            isActive: false,
          },
        });
      }
    });

    return Promise.all([...createPromises, ...deletePromises]);
  }
  synchronizeDebtPayment(syncDebtPayment: SyncDebtPayment) {
    const { toCreateOrUpdate, toDelete } = syncDebtPayment;

    const createPromises = toCreateOrUpdate.map(async (debtPayment) => {
      const existDebtPayment = await this.prismaService.debtPayment.findFirst({
        where: {
          id: debtPayment.id,
        },
      });

      if (existDebtPayment) {
        return this.prismaService.debtPayment.update({
          where: {
            id: debtPayment.id,
          },
          data: debtPayment,
        });
      }

      const { id, ...rest } = debtPayment;

      return this.prismaService.debtPayment.create({
        data: rest,
      });
    });

    const deletePromises = toDelete.map(async (id) => {
      const existDebtPayment = await this.prismaService.debtPayment.findFirst({
        where: {
          id,
        },
      });

      if (existDebtPayment) {
        return this.prismaService.debtPayment.update({
          where: {
            id,
          },
          data: {
            deletedAt: new Date(),
            isActive: false,
          },
        });
      }
    });

    return Promise.all([...createPromises, ...deletePromises]);
  }

  synchronizeProductSale(syncProductSale: SyncProductSale) {
    const { toCreateOrUpdate, toDelete } = syncProductSale;

    const createPromises = toCreateOrUpdate.map(async (productSale) => {
      const existProductSale = await this.prismaService.productSale.findFirst({
        where: {
          id: productSale.id,
        },
      });

      if (existProductSale) {
        return this.prismaService.productSale.update({
          where: {
            id: productSale.id,
          },
          data: productSale,
        });
      }

      const { id, ...rest } = productSale;

      return this.prismaService.productSale.create({
        data: rest,
      });
    });

    const deletePromises = toDelete.map(async (id) => {
      const existProductSale = await this.prismaService.productSale.findFirst({
        where: {
          id,
        },
      });

      if (existProductSale) {
        return this.prismaService.productSale.update({
          where: {
            id,
          },
          data: {
            deletedAt: new Date(),
            isActive: false,
          },
        });
      }
    });

    return Promise.all([...createPromises, ...deletePromises]);
  }
}
