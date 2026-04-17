package com.springboot.music.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.springboot.music.dto.UserDTO;
import com.springboot.music.entity.Role;
import com.springboot.music.entity.User;
import com.springboot.music.mapper.UserMapper;
import com.springboot.music.repository.RoleRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.responsemodel.LoginResponse;
import com.springboot.music.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Value("${app.google.client-id}")
    private String googleClientId;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userMapper = userMapper;
    }

    // Đăng nhập
    public LoginResponse login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email);

        if(user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail());
        UserDTO userDTO = userMapper.toDto(user);
        return new LoginResponse(token, userDTO);
    }

    // Đăng nhập bằng Google
    public LoginResponse loginWithGoogle(String credential) {
        try {
            // 1. Cấu hình công cụ xác minh của Google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // 2. Xác minh token
            GoogleIdToken idToken = verifier.verify(credential);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                // 3. Lấy thông tin từ Google
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");

                // 4. Kiểm tra xem user đã tồn tại trong DB chưa
                User user = userRepository.findByEmail(email);

                if (user == null) {
                    // Nếu chưa có, tạo tài khoản mới tự động
                    user = new User();
                    user.setEmail(email);
                    user.setName(name);
                    user.setAvatarUrl(pictureUrl);
                    user.setAuthProvider("google");
                    user.setProviderId(payload.getSubject()); // ID duy nhất của Google
                    user.setIsActive(true);
                    user.setIsEmailVerified(true);
                    user.setCreatedAt(LocalDateTime.now());

                    Role userRole = roleRepository.findByName("user");
                    if (userRole == null) {
                        throw new RuntimeException("Default role 'user' not found in database");
                    }
                    user.setRole(userRole);

                    // Lưu mật khẩu rỗng
                    user.setPassword(null);

                    user = userRepository.save(user);
                }

                // 5. Tạo JWT và trả về
                String token = jwtService.generateToken(user.getEmail());
                UserDTO userDTO = userMapper.toDto(user);

                return new LoginResponse(token, userDTO);

            } else {
                throw new RuntimeException("Invalid ID token.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
}