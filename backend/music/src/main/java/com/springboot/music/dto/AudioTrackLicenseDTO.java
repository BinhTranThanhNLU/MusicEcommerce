package com.springboot.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioTrackLicenseDTO {
    private Integer licenseId;
    private String licenseType;
    private String description;
    private Double price;
}
