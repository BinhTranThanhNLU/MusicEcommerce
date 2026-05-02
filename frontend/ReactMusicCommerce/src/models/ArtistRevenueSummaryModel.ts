import type { RevenueChartModel } from "./RevenueChartModel";
import type { RevenuePieModel } from "./RevenuePieModel";
import type { TopTrackModel } from "./TopTrackModel";

export interface ArtistRevenueSummaryModel {
  availableBalance: number;
  pendingBalance: number;
  totalRevenue: number;
  chartData: RevenueChartModel[];
  distributionData: RevenuePieModel[];
  topTracks: TopTrackModel[];
}