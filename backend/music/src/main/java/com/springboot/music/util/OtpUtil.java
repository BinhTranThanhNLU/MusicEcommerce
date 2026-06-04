package com.springboot.music.util;

import java.security.SecureRandom;

public class OtpUtil {

    private static final String DIGITS = "0123456789";
    private static final int OTP_LENGTH = 6;
    private static final SecureRandom random = new SecureRandom();

    /**
     * Sinh mã OTP 6 số ngẫu nhiên
     */
    public static String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
        }
        return otp.toString();
    }

    /**
     * Kiểm tra xem string có phải là OTP 6 số hợp lệ không
     */
    public static boolean isValidOtpFormat(String otp) {
        if (otp == null || otp.length() != OTP_LENGTH) {
            return false;
        }
        return otp.matches("^\\d{6}$");
    }
}

