package com.springboot.music.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserDetailDTO {

    private Integer id;
    private String name;
    private String email;
    private String avatarUrl;
    private String role;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private String authProvider;
    private String providerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

