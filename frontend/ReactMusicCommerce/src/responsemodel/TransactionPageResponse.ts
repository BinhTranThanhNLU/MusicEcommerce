import type { TransactionModel } from "../models/TransactionModel";

export interface TransactionPageResponse {
  transactions: TransactionModel[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}