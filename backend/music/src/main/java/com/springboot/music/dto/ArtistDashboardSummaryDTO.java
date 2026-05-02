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
    private List<RecentActivityDTO> recentActivities;
}
