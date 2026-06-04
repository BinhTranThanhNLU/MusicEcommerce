package com.springboot.music.controller;

import com.springboot.music.requestmodel.*;
import com.springboot.music.responsemodel.LoginResponse;
import com.springboot.music.responsemodel.SendOtpResponse;
import com.springboot.music.responsemodel.VerifyOtpResponse;
import com.springboot.music.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<LoginResponse> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        LoginResponse response = authService.loginWithGoogle(request.getCredential());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/send-otp")
    public ResponseEntity<SendOtpResponse> sendEmailVerificationOtp(@Valid @RequestBody SendEmailOtpRequest request) {
        SendOtpResponse response = authService.sendEmailVerificationOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp-and-register")
    public ResponseEntity<VerifyOtpResponse> verifyEmailOtpAndRegister(
            @Valid @RequestBody RegisterWithOtpRequest request) {
        VerifyOtpResponse response = authService.verifyEmailOtpAndRegister(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("Password reset instructions have been sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password has been reset successfully. You can now login.");
    }
}



