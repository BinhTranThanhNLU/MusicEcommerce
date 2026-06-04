package com.springboot.music.responsemodel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpResponse {

    private String message;
    private String email;
    private Integer expiresInMinutes; // Số phút mã OTP còn hợp lệ (thường là 5 phút)

}

