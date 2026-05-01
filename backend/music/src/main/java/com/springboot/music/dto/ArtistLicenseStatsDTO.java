package com.springboot.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtistLicenseStatsDTO {
    private long totalLicenses;
    private long commercialAndExclusiveLicenses;
    private long copyrightWarnings;
}
