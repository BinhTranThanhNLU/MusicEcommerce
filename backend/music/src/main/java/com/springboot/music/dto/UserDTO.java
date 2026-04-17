package com.springboot.music.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private int id;
    private String name;
    private String email;
    private String avatarUrl;
    private String role;
    private String authProvider;
    private Boolean isEmailVerified;

}
