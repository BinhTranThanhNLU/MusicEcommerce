package com.springboot.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminTopTrackDTO {
    private Integer id;
    private String title;
    private String audioType;
    private String licenseType;
    private Long salesCount;
    private Double revenue;
    private Double adminRevenue;
    private String cover;
}

