package com.springboot.music.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserDTO {
    private int id;
    private String name;
    private String email;
    private String avatarUrl;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
