package com.springboot.music.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verification_otp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerificationOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otp_id")
    private Integer id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "otp_code", nullable = false, length = 6)
    private String otpCode;

    @Column(name = "attempts", nullable = false)
    private Integer attempts = 0;

    @Column(name = "max_attempts", nullable = false)
    private Integer maxAttempts = 5; // Tối đa 5 lần nhập sai

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    // Kiểm tra xem OTP có còn hợp lệ không
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    // Kiểm tra xem có vượt quá số lần nhập sai không
    public boolean isMaxAttemptsExceeded() {
        return attempts >= maxAttempts;
    }

    // Kiểm tra xem OTP có hợp lệ không
    public boolean isValid() {
        return !isExpired() && !isMaxAttemptsExceeded() && !isVerified;
    }
}

