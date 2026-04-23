package com.springboot.music.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountOrderItemDTO {

    private Integer orderDetailId;
    private Integer audioId;
    private String title;
    private String audioType;
    private String artistName;
    private String coverImage;
    private String licenseType;
    private Double price;
    private Integer duration;
    private String musicDownloadUrl;
    private String certificateDownloadUrl;
}

