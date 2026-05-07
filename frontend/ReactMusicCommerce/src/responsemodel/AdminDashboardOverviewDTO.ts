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
}