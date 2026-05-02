import type { DashboardStatsModel } from "./DashboardStatsModel";
import type { RecentActivityModel } from "./RecentActivityModel";

export interface ArtistDashboardSummaryModel {
  stats: DashboardStatsModel;
  recentActivities: RecentActivityModel[];
}