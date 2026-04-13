package com.springboot.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MoodDTO {
    private Integer id;
    private String name;
}
