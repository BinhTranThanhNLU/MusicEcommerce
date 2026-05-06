import type { AccountOrderResponse } from "./AccountOrderResponse";

export interface AdminUserOrderPageResponse {
  orders: AccountOrderResponse[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
