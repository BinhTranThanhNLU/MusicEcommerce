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
import com.springboot.music.requestmodel.RegisterRequest;
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

    // Đăng ký
    public void register(RegisterRequest request) {
        // 1. Kiểm tra email đã tồn tại chưa
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email is already registered");
        }

        // 2. Xác định Role (Chỉ cho phép user hoặc artist)
        String requestedRole = request.getRole() != null ? request.getRole().toLowerCase() : "user";
        if (!requestedRole.equals("user") && !requestedRole.equals("artist")) {
            requestedRole = "user"; // Nếu gửi bậy bạ, mặc định cho về user
        }

        Role userRole = roleRepository.findByName(requestedRole);
        if (userRole == null) {
            throw new RuntimeException("Role '" + requestedRole + "' not found in database");
        }

        // 3. Tạo User mới
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Mã hóa mật khẩu
        user.setAuthProvider("local");
        user.setIsActive(true);
        user.setIsEmailVerified(true); // tạm thời cho đã xác minh email luôn để dễ test, sau này sẽ thêm chức năng gửi mail xác minh
        user.setCreatedAt(LocalDateTime.now());

        // Gán Role đã xác định
        user.setRole(userRole);

        // 4. Lưu vào DB
        userRepository.save(user);
    }

    // Quên mật khẩu (Tạo token và "gửi mail")
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User with this email not found");
        }

        // Sinh ra một JWT token thời hạn ngắn (15 phút)
        String resetToken = jwtService.generateResetPasswordToken(email);

        // TODO: Gửi email thực tế chứa link reset.
        // Trong thực tế, bạn sẽ dùng JavaMailSender để gửi link dạng: http://localhost:3000/reset-password?token=resetToken
        // Tạm thời log ra console để test dưới local:
        System.out.println("==== RESET PASSWORD LINK ====");
        System.out.println("http://localhost:3000/reset-password?token=" + resetToken);
        System.out.println("=============================");
    }

    // Đặt lại mật khẩu
    public void resetPassword(String token, String newPassword) {
        // 1. Lấy email từ token (jwtService tự kiểm tra token hết hạn chưa)
        String email;
        try {
            email = jwtService.extractEmail(token);
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired password reset token");
        }

        // 2. Tìm user
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // 3. Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}