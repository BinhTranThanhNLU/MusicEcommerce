import type { AdminLicenseModel } from "../models/AdminLicenseModel";

export interface AdminLicensePageResponse {
  licenses: AdminLicenseModel[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}