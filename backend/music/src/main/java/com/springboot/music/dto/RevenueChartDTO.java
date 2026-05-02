package com.springboot.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueChartDTO {
    private String name;     // VD: "Tháng 10", "Tháng 11"
    private Double revenue;
}