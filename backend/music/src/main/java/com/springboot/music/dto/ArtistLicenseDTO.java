package com.springboot.music.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtistLicenseDTO {

    private Integer orderDetailId;
    private String watermarkId;         // Dùng thay thế cho "Mã giấy phép" (Vd: WMK-A1B2C3D4)
    private String customerName;
    private String customerEmail;
    private Integer audioId;
    private String trackName;
    private String coverImage;
    private String licenseType;
    private Double price;
    private String licenseStatus;       // "ACTIVE", "EXPIRED", "REVOKED"
    private LocalDateTime issuedAt;
    private LocalDateTime expiredAt;
}
