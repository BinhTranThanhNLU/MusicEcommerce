package com.springboot.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopTrackDTO {
    private Integer id;
    private String title;
    private String type;
    private Long salesCount;
    private Double revenue;  // Tổng tiền kiếm được
    private String cover;    // Ảnh bìa bài hát
}
