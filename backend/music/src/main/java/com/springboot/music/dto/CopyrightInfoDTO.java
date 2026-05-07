package com.springboot.music.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CopyrightInfoDTO {
    private Integer id;
    private Integer audioId;
    private String audioTitle;
    private Integer artistId;
    private String artistName;
    private String ownerName;
    private String isrcCode;
    private String certificateFileUrl;
    private LocalDateTime registeredAt;
}

