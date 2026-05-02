package com.springboot.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private Double monthlyRevenue;
    private Long totalCustomers;
    private Long totalReviews;
    private Long activeTracks;     // Tác phẩm đang bán (Approved)
}
