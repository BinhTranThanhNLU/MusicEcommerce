package com.springboot.music.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOrderDetailDTO {

    private Integer orderDetailId;
    private Integer audioId;
    private String trackTitle;
    private String artistName;
    private String coverImage;
    private String licenseType;
    private Double price;
    private Integer duration;
    private String watermarkId;
    private LocalDateTime expiredAt;
    private String licenseStatus;
}

