import type { DashboardStatsModel } from "./DashboardStatsModel";
import type { RecentActivityModel } from "./RecentActivityModel";
import type { RevenueChartModel } from "./RevenueChartModel";
import type { RevenuePieModel } from "./RevenuePieModel";
import type { TopTrackModel } from "./TopTrackModel";

export interface ArtistDashboardSummaryModel {
  stats: DashboardStatsModel;
  revenueChart: RevenueChartModel[];
  licenseDistribution: RevenuePieModel[];
  topPerformingTracks: TopTrackModel[];
  recentActivities: RecentActivityModel[];
}