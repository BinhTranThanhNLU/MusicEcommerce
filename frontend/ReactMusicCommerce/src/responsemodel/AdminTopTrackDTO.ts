export interface AdminTopTrackDTO {
  id: number;
  title: string;
  audioType: string;
  licenseType: string;
  salesCount: number;
  revenue: number;
  adminRevenue: number;
  cover: string | null;
}