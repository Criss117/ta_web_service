import { IsObject } from 'class-validator';
import {
  SyncClient,
  SyncDebtPayment,
  SyncProduct,
  SyncProductSale,
  SyncTicket,
} from '../models/types';

export class SyncRemoteDto {
  @IsObject()
  Product: SyncProduct;

  @IsObject()
  Client: SyncClient;

  @IsObject()
  DebtPayment: SyncDebtPayment;

  @IsObject()
  Ticket: SyncTicket;

  @IsObject()
  ProductSale: SyncProductSale;
}
