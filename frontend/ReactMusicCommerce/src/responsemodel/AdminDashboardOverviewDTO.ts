export interface AdminRevenuePointDTO {
  label: string;
  revenue: number;
}

export interface AdminGrowthPointDTO {
  label: string;
  newUsers: number;
  newArtists: number;
}

export interface AdminContentDistributionDTO {
  contentType: string;
  count: number;
  percentage: number;
}

export interface AdminRevenuePieDTO {
  label?: string;
  name?: string;
  value?: number;
  revenue?: number;
  color?: string;
}

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

export interface AdminDashboardOverviewDTO {
  period: string;
  points: number;
  totalAudioTracks: number;
  totalArtists: number;
  totalUsers: number;
  totalRevenue: number;
  revenueTrend: AdminRevenuePointDTO[];
  growthTrend: AdminGrowthPointDTO[];
  contentDistribution: AdminContentDistributionDTO[];
  licenseRevenueDistribution?: AdminRevenuePieDTO[];
  topSellingTracks?: AdminTopTrackDTO[];
}