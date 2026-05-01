import type { ArtistLicenseModel } from "../models/ArtistLicenseModel";

export interface ArtistLicensePageResponse {
  licenses: ArtistLicenseModel[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}