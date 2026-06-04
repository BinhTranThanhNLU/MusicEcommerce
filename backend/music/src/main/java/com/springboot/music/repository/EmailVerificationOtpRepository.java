package com.springboot.music.repository;

import com.springboot.music.entity.EmailVerificationOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationOtpRepository extends JpaRepository<EmailVerificationOtp, Integer> {

    /**
     * Tìm OTP gần đây nhất cho email
     */
    Optional<EmailVerificationOtp> findFirstByEmailOrderByCreatedAtDesc(String email);

    /**
     * Tìm OTP hợp lệ cho email
     */
    @Query("SELECT o FROM EmailVerificationOtp o WHERE o.email = ?1 AND o.isVerified = false ORDER BY o.createdAt DESC LIMIT 1")
    Optional<EmailVerificationOtp> findValidOtpByEmail(String email);
}

