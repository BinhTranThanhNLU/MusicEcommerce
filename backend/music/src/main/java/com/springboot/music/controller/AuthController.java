package com.springboot.music.controller;

import com.springboot.music.requestmodel.GoogleLoginRequest;
import com.springboot.music.requestmodel.LoginRequest;
import com.springboot.music.responsemodel.LoginResponse;
import com.springboot.music.service.AuthService;
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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<LoginResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        LoginResponse response = authService.loginWithGoogle(request.getCredential());
        return ResponseEntity.ok(response);
    }
}
