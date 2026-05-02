package com.springboot.music.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtistRevenueSummaryDTO {

    private Double availableBalance;  // Số dư khả dụng (Đã trừ phí)
    private Double pendingBalance;    // Chờ xử lý (Mô phỏng)
    private Double totalRevenue;      // Tổng thu nhập trọn đời

    private List<RevenueChartDTO> chartData;
    private List<RevenuePieDTO> distributionData;
    private List<TopTrackDTO> topTracks;
}
