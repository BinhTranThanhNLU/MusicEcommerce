export interface TransactionModel {
  id: number;
  createdAt: string;
  type: string;
  title: string;
  desc: string;
  amount: number;
  status: string;
}