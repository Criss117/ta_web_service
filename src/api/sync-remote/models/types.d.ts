import {
  Client,
  DebtPayment,
  Product,
  ProductSale,
  Ticket,
} from '@prisma/client';

export type TableName =
  | 'Product'
  | 'Client'
  | 'DebtPayment'
  | 'Ticket'
  | 'ProductSale';

export type SyncState = 'PENDING' | 'SUCCESS' | 'FAILED';

export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE' | 'SETTLE_DEBT';

export const SyncStateEnum = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export const SyncOperationEnum = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SETTLE_DEBT: 'SETTLE_DEBT',
} as const;

export const SyncTableEnum = {
  Product: 'Product',
  Client: 'Client',
  DebtPayment: 'DebtPayment',
  Ticket: 'Ticket',
  ProductSale: 'ProductSale',
} as const;

export interface SyncClient {
  toDelete: number[];
  toCreateOrUpdate: (Client | undefined | null)[];
}

export interface SyncProduct {
  toDelete: number[];
  toCreateOrUpdate: (Product | undefined | null)[];
}

export interface SyncProductSale {
  toDelete: number[];
  toCreateOrUpdate: (ProductSale | undefined | null)[];
}

export interface SyncTicket {
  toDelete: number[];
  toCreateOrUpdate: (Ticket | undefined | null)[];
}

export interface SyncDebtPayment {
  toDelete: number[];
  toCreateOrUpdate: (DebtPayment | undefined | null)[];
}
