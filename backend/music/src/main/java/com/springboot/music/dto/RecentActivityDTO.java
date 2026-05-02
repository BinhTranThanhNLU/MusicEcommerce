package com.springboot.music.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentActivityDTO {
    private String user;
    private String action;
    private String icon;
    private String color;
    private LocalDateTime createdAt; // Để frontend tự format giờ hoặc Java tự sort
}
