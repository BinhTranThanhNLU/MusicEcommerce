package com.springboot.music;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordGeneratorTest {

    @Test
    public void generatePasswordHash() {

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        String rawPassword = "Hieuthuhai0402@";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        System.out.println("Mật khẩu đã băm (Copy chuỗi bên dưới paste vào DB):");
        System.out.println(encodedPassword);
        System.out.println("=====================================================");
        System.out.println("=====================================================");
        System.out.println("Mật khẩu gốc: " + rawPassword);
    }
}