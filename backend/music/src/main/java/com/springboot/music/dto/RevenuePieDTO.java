package com.springboot.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenuePieDTO {
    private String name;     // Loại giấy phép
    private Double value;    // Tổng tiền
    private String color;    // Mã màu hex
}
