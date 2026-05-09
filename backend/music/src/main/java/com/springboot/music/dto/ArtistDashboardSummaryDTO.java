package com.springboot.music.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtistDashboardSummaryDTO {
    private DashboardStatsDTO stats;
    private List<RevenueChartDTO> revenueChart;
    private List<RevenuePieDTO> licenseDistribution;
    private List<TopTrackDTO> topPerformingTracks;
    private List<RecentActivityDTO> recentActivities;
}
