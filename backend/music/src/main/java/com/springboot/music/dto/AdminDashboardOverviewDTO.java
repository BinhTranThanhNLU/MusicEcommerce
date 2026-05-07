package com.springboot.music.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardOverviewDTO {
    private String period;
    private Integer points;

    private Long totalAudioTracks;
    private Long totalArtists;
    private Long totalUsers;
    private Double totalRevenue;

    private List<AdminRevenuePointDTO> revenueTrend;
    private List<AdminGrowthPointDTO> growthTrend;
    private List<AdminContentDistributionDTO> contentDistribution;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminRevenuePointDTO {
        private String label;
        private Double revenue;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminGrowthPointDTO {
        private String label;
        private Long newUsers;
        private Long newArtists;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminContentDistributionDTO {
        private String contentType;
        private Long count;
        private Double percentage;
    }
}

