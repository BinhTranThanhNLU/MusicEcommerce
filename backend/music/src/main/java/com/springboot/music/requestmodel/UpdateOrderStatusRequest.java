package com.springboot.music.requestmodel;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderStatusRequest {

    @NotBlank(message = "Trạng thái không được trống")
    private String status;
}

