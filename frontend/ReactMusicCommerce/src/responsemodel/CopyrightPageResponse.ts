import type { CopyrightInfoDTO } from "../models/CopyrightInfoDTO";

export interface CopyrightPageResponse {
  items: CopyrightInfoDTO[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}