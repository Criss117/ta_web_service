import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { SyncRemoteDto } from './dto/sync-remote.dto';
import {
  SyncClient,
  SyncDebtPayment,
  SyncProduct,
  SyncProductSale,
  SyncTicket,
} from './models/types';
import { PrismaService } from '@/src/prisma/prisma.service';
import { PrismaTx } from '@/src/prisma/models/types';

@Injectable()
export class SyncRemoteService {
  constructor(private readonly prismaService: PrismaService) {}
  async synchronize(syncRemoteDto: SyncRemoteDto) {
    try {
      await this.prismaService.$transaction(async (tx) => {
        const syncClient = await this.synchronizeClients(
          syncRemoteDto.Client,
          tx,
        );
        const syncProduct = await this.synchronizeProducts(
          syncRemoteDto.Product,
          tx,
        );
        const syncTicket = await this.synchronizeTicket(
          syncRemoteDto.Ticket,
          tx,
        );
        const syncProductSale = await this.synchronizeProductSale(
          syncRemoteDto.ProductSale,
          tx,
        );
        const syncDebtPayment = await this.synchronizeDebtPayment(
          syncRemoteDto.DebtPayment,
          tx,
        );

        return [
          syncClient,
          syncProduct,
          syncProductSale,
          syncTicket,
          syncDebtPayment,
        ];
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Synchronized successfully',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  synchronizeClients(syncClient: SyncClient, tx: PrismaTx) {
    const { toCreateOrUpdate, toDelete } = syncClient;

    const createPromises = toCreateOrUpdate.map(async (client) => {
      const existClient = await tx.client.findFirst({
        where: {
          ccNumber: client.ccNumber,
          id: client.id,
        },
      });

      if (existClient) {
        return tx.client.update({
          where: {
            id: client.id,
          },
          data: {
            ccNumber: client.ccNumber,
            fullName: client.fullName,
            address: client.address,
            phone: client.phone,
            creditLimit: client.creditLimit,
            balance: client.balance,
            createdAt: client.createdAt,
          },
        });
      }

      return tx.client.create({
        data: {
          id: client.id,
          ccNumber: client.ccNumber,
          fullName: client.fullName,
          address: client.address,
          phone: client.phone,
          creditLimit: client.creditLimit,
          balance: client.balance,
          createdAt: client.createdAt,
        },
      });
    });

    const deletePromises = toDelete.map(async (id) => {
      const existClient = await tx.client.findFirst({
        where: {
          id,
        },
      });

      if (existClient) {
        return tx.client.update({
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
  synchronizeProducts(syncProduct: SyncProduct, tx: PrismaTx) {
    const { toCreateOrUpdate, toDelete } = syncProduct;

    const createPromises = toCreateOrUpdate.map(async (product) => {
      const existProduct = await tx.product.findFirst({
        where: {
          id: product.id,
          barcode: product.barcode,
        },
      });

      if (existProduct) {
        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            barcode: product.barcode,
            description: product.description,
            costPrice: product.costPrice,
            salePrice: product.salePrice,
            wholesalePrice: product.wholesalePrice,
            stock: product.stock,
            minStock: product.minStock,
            createdAt: product.createdAt,
          },
        });
      }

      return tx.product.create({
        data: {
          id: product.id,
          barcode: product.barcode,
          description: product.description,
          costPrice: product.costPrice,
          salePrice: product.salePrice,
          wholesalePrice: product.wholesalePrice,
          stock: product.stock,
          minStock: product.minStock,
          createdAt: product.createdAt,
        },
      });
    });

    const deletePromises = toDelete.map(async (id) => {
      const existProduct = await tx.product.findFirst({
        where: {
          id,
        },
      });

      if (existProduct) {
        return tx.product.update({
          where: {
            id,
          },
          data: {
            barcode: 'deleted' + existProduct.barcode,
            deletedAt: new Date(),
            isActive: false,
          },
        });
      }
    });

    return Promise.all([...createPromises, ...deletePromises]);
  }
  synchronizeTicket(syncTicket: SyncTicket, tx: PrismaTx) {
    const { toCreateOrUpdate, toDelete } = syncTicket;

    const createPromises = toCreateOrUpdate.map(async (ticket) => {
      const existTicket = await tx.ticket.findFirst({
        where: {
          id: ticket.id,
          clientId: ticket.clientId,
        },
      });

      if (existTicket) {
        return tx.ticket.update({
          where: {
            id: ticket.id,
          },
          data: {
            clientId: ticket.clientId,
            total: ticket.total,
            createdAt: ticket.createdAt,
            state: ticket.state,
          },
        });
      }

      return tx.ticket.create({
        data: {
          id: ticket.id,
          clientId: ticket.clientId,
          total: ticket.total,
          createdAt: ticket.createdAt,
          state: ticket.state,
        },
      });
    });

    const deletePromises = toDelete.map(async (id) => {
      const existTicket = await tx.ticket.findFirst({
        where: {
          id,
        },
      });

      if (existTicket) {
        return tx.ticket.update({
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
  synchronizeDebtPayment(syncDebtPayment: SyncDebtPayment, tx: PrismaTx) {
    const { toCreateOrUpdate, toDelete } = syncDebtPayment;

    const createPromises = toCreateOrUpdate.map(async (debtPayment) => {
      const existDebtPayment = await tx.debtPayment.findFirst({
        where: {
          id: debtPayment.id,
        },
      });

      if (existDebtPayment) {
        return tx.debtPayment.update({
          where: {
            id: debtPayment.id,
          },
          data: {
            amount: debtPayment.amount,
            clientId: debtPayment.clientId,
            createdAt: debtPayment.createdAt,
          },
        });
      }

      return tx.debtPayment.create({
        data: {
          id: debtPayment.id,
          amount: debtPayment.amount,
          clientId: debtPayment.clientId,
          createdAt: debtPayment.createdAt,
        },
      });
    });

    const deletePromises = toDelete.map(async (id) => {
      const existDebtPayment = await tx.debtPayment.findFirst({
        where: {
          id,
        },
      });

      if (existDebtPayment) {
        return tx.debtPayment.update({
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

  synchronizeProductSale(syncProductSale: SyncProductSale, tx: PrismaTx) {
    const { toCreateOrUpdate, toDelete } = syncProductSale;

    const createPromises = toCreateOrUpdate.map(async (productSale) => {
      const existProductSale = await tx.productSale.findFirst({
        where: {
          id: productSale.id,
        },
      });

      if (existProductSale) {
        return tx.productSale.update({
          where: {
            id: productSale.id,
          },
          data: {
            salePrice: productSale.salePrice,
            quantity: productSale.quantity,
            subTotal: productSale.subTotal,
            createdAt: productSale.createdAt,
            productId: productSale.productId,
            ticketId: productSale.ticketId,
          },
        });
      }

      return tx.productSale.create({
        data: {
          id: productSale.id,
          salePrice: productSale.salePrice,
          quantity: productSale.quantity,
          subTotal: productSale.subTotal,
          createdAt: productSale.createdAt,
          productId: productSale.productId,
          ticketId: productSale.ticketId,
        },
      });
    });

    const deletePromises = toDelete.map(async (id) => {
      const existProductSale = await tx.productSale.findFirst({
        where: {
          id,
        },
      });

      if (existProductSale) {
        return tx.productSale.update({
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
