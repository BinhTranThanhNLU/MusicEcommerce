package com.springboot.music.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryItemDTO {
    
    private Integer audioId;
    private String title;
    private String audioType;
    private String artistName;
    private String coverImage;
    private String licenseType;
    private String originalFileUrl;
    private String watermarkedFileUrl;
    private String certificateDownloadUrl;
    private Boolean certificateAvailable;
    private Integer duration;
    private LocalDateTime purchasedAt;
    private Integer orderId;
    private Integer orderDetailId;
}

