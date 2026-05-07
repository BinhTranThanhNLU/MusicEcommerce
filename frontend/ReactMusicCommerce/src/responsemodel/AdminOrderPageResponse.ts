import type { AdminOrderDTO } from "../models/AdminOrderDTO";

export interface AdminOrderPageResponse {
  orders: AdminOrderDTO[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
