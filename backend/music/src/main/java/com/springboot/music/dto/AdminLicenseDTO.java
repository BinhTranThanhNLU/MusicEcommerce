package com.springboot.music.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLicenseDTO {

    private Integer orderDetailId;
    private Integer orderId;
    private Integer audioId;
    private String trackName;
    private String artistName;
    private String customerName;
    private String customerEmail;
    private String coverImage;
    private String watermarkId;
    private String licenseType;
    private Double price;
    private String licenseStatus;
    private String paymentStatus;
    private LocalDateTime issuedAt;
    private LocalDateTime expiredAt;
}

