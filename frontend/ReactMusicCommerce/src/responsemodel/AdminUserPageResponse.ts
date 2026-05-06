import type { AdminUserModel } from "../models/AdminUserModel";

export interface AdminUserPageResponse {
  users: AdminUserModel[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}