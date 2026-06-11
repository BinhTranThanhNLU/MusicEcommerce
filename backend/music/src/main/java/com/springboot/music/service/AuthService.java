package com.springboot.music.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.springboot.music.dto.UserDTO;
import com.springboot.music.entity.EmailVerificationOtp;
import com.springboot.music.entity.Role;
import com.springboot.music.entity.User;
import com.springboot.music.exception.EmailAlreadyExistsException;
import com.springboot.music.exception.InvalidCredentialsException;
import com.springboot.music.exception.InvalidRoleException;
import com.springboot.music.mapper.UserMapper;
import com.springboot.music.repository.EmailVerificationOtpRepository;
import com.springboot.music.repository.RoleRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.requestmodel.RegisterRequest;
import com.springboot.music.requestmodel.RegisterWithOtpRequest;
import com.springboot.music.requestmodel.SendEmailOtpRequest;
import com.springboot.music.requestmodel.VerifyEmailOtpRequest;
import com.springboot.music.responsemodel.LoginResponse;
import com.springboot.music.responsemodel.SendOtpResponse;
import com.springboot.music.responsemodel.VerifyOtpResponse;
import com.springboot.music.security.JwtService;
import com.springboot.music.util.OtpUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final EmailService emailService;
    private final EmailVerificationOtpRepository emailVerificationOtpRepository;

    @Value("${app.google.client-id}")
    private String googleClientId;

    @Value("${app.otp.expiry-minutes:5}")
    private Integer otpExpiryMinutes;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService, UserMapper userMapper,
                       EmailService emailService, EmailVerificationOtpRepository emailVerificationOtpRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userMapper = userMapper;
        this.emailService = emailService;
        this.emailVerificationOtpRepository = emailVerificationOtpRepository;
    }

    // Bước 1: Gửi OTP tới email
    public SendOtpResponse sendEmailVerificationOtp(SendEmailOtpRequest request) {
        // 1. Kiểm tra email đã tồn tại chưa
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email đã được đăng ký");
        }

        // 2. Tạo OTP mới
        String otp = OtpUtil.generateOtp();

        // 3. Xóa OTP cũ nếu có
        try {
            var oldOtp = emailVerificationOtpRepository.findFirstByEmailOrderByCreatedAtDesc(request.getEmail());
            if (oldOtp.isPresent()) {
                emailVerificationOtpRepository.delete(oldOtp.get());
            }
        } catch (Exception e) {
            // Ignore if old OTP doesn't exist
        }

        // 4. Lưu OTP vào database
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(otpExpiryMinutes);
        EmailVerificationOtp newOtp = EmailVerificationOtp.builder()
                .email(request.getEmail())
                .otpCode(otp)
                .attempts(0)
                .maxAttempts(5)
                .createdAt(LocalDateTime.now())
                .expiresAt(expiresAt)
                .isVerified(false)
                .build();

        emailVerificationOtpRepository.save(newOtp);

        // 5. Gửi OTP tới email
        emailService.sendEmailVerificationOtp(request.getEmail(), otp, otpExpiryMinutes);

        return new SendOtpResponse(
                "Mã OTP đã được gửi tới email của bạn",
                request.getEmail(),
                otpExpiryMinutes
        );
    }

    // Bước 2: Xác minh OTP và tạo tài khoản
    @Transactional
    public VerifyOtpResponse verifyEmailOtpAndRegister(VerifyEmailOtpRequest verifyRequest, SendEmailOtpRequest registerRequest) {
        // 1. Lấy OTP từ database
        var otpRecord = emailVerificationOtpRepository.findFirstByEmailOrderByCreatedAtDesc(verifyRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã OTP. Vui lòng yêu cầu gửi lại."));

        // 2. Kiểm tra OTP
        if (otpRecord.isExpired()) {
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng yêu cầu lại.");
        }

        if (otpRecord.isMaxAttemptsExceeded()) {
            throw new RuntimeException("Bạn đã nhập sai quá nhiều lần. Vui lòng yêu cầu mã OTP mới.");
        }

        if (!otpRecord.getOtpCode().equals(verifyRequest.getOtp())) {
            otpRecord.setAttempts(otpRecord.getAttempts() + 1);
            emailVerificationOtpRepository.save(otpRecord);
            int remainingAttempts = otpRecord.getMaxAttempts() - otpRecord.getAttempts();
            throw new RuntimeException("Mã OTP không đúng. Còn " + remainingAttempts + " lần thử.");
        }

        // 3. Đánh dấu OTP là đã xác minh
        otpRecord.setIsVerified(true);
        otpRecord.setVerifiedAt(LocalDateTime.now());
        emailVerificationOtpRepository.save(otpRecord);

        // 4. Tạo tài khoản mới
        // Kiểm tra email đã tồn tại chưa (double check)
        if (userRepository.findByEmail(verifyRequest.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email đã được đăng ký");
        }

        // Xác định Role
        String requestedRole = registerRequest.getRole() != null ? registerRequest.getRole().toLowerCase() : "user";
        if (!requestedRole.equals("user") && !requestedRole.equals("artist")) {
            requestedRole = "user";
        }

        Role userRole = roleRepository.findByName(requestedRole);
        if (userRole == null) {
            throw new InvalidRoleException("Role '" + requestedRole + "' not found in database");
        }

        // Tạo User mới
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(verifyRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setAuthProvider("local");
        user.setIsActive(true);
        user.setIsEmailVerified(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setRole(userRole);

        userRepository.save(user);

        return new VerifyOtpResponse(
                "Email xác minh thành công! Tài khoản đã được tạo.",
                true,
                verifyRequest.getEmail()
        );
    }

    // Xác minh OTP và tạo tài khoản (phiên bản kết hợp)
    @Transactional
    public VerifyOtpResponse verifyEmailOtpAndRegister(RegisterWithOtpRequest request) {
        // 1. Lấy OTP từ database
        var otpRecord = emailVerificationOtpRepository.findFirstByEmailOrderByCreatedAtDesc(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã OTP. Vui lòng yêu cầu gửi lại."));

        // 2. Kiểm tra OTP
        if (otpRecord.isExpired()) {
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng yêu cầu lại.");
        }

        if (otpRecord.isMaxAttemptsExceeded()) {
            throw new RuntimeException("Bạn đã nhập sai quá nhiều lần. Vui lòng yêu cầu mã OTP mới.");
        }

        if (!otpRecord.getOtpCode().equals(request.getOtp())) {
            otpRecord.setAttempts(otpRecord.getAttempts() + 1);
            emailVerificationOtpRepository.save(otpRecord);
            int remainingAttempts = otpRecord.getMaxAttempts() - otpRecord.getAttempts();
            throw new RuntimeException("Mã OTP không đúng. Còn " + remainingAttempts + " lần thử.");
        }

        // 3. Đánh dấu OTP là đã xác minh
        otpRecord.setIsVerified(true);
        otpRecord.setVerifiedAt(LocalDateTime.now());
        emailVerificationOtpRepository.save(otpRecord);

        // 4. Tạo tài khoản mới
        // Kiểm tra email đã tồn tại chưa (double check)
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email đã được đăng ký");
        }

        // Xác định Role
        String requestedRole = request.getRole() != null ? request.getRole().toLowerCase() : "user";
        if (!requestedRole.equals("user") && !requestedRole.equals("artist")) {
            requestedRole = "user";
        }

        Role userRole = roleRepository.findByName(requestedRole);
        if (userRole == null) {
            throw new InvalidRoleException("Role '" + requestedRole + "' not found in database");
        }

        // Tạo User mới
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAuthProvider("local");
        user.setIsActive(true);
        user.setIsEmailVerified(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setRole(userRole);

        userRepository.save(user);

        return new VerifyOtpResponse(
                "Email xác minh thành công! Tài khoản đã được tạo.",
                true,
                request.getEmail()
        );
    }

    // Đăng ký (phương thức cũ - giữ lại cho tương thích)
    public void register(RegisterRequest request) {
        // 1. Kiểm tra email đã tồn tại chưa
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email đã được đăng ký");
        }

        // 2. Xác định Role (Chỉ cho phép user hoặc artist)
        String requestedRole = request.getRole() != null ? request.getRole().toLowerCase() : "user";
        if (!requestedRole.equals("user") && !requestedRole.equals("artist")) {
            requestedRole = "user"; // Nếu gửi bậy bạ, mặc định cho về user
        }

        Role userRole = roleRepository.findByName(requestedRole);
        if (userRole == null) {
            throw new InvalidRoleException("Role '" + requestedRole + "' not found in database");
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

    // Đăng nhập
    public LoginResponse login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email);

        if(user == null) {
            throw new InvalidCredentialsException("Sai email hoặc mật khẩu");
        }

        if (user.getAuthProvider() != null && !user.getAuthProvider().equals("local")) {
            throw new InvalidCredentialsException("Tài khoản này được liên kết với " + user.getAuthProvider() + ". Vui lòng đăng nhập bằng " + user.getAuthProvider() + ".");
        }

        if (user.getIsActive() != null && !user.getIsActive()) {
            throw new InvalidCredentialsException("Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new InvalidCredentialsException("Sai email hoặc mật khẩu");
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
            throw new RuntimeException("Xác thực Google thất bại: " + e.getMessage());
        }
    }

    // Quên mật khẩu (Tạo token và "gửi mail")
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return;
        }

        // Sinh ra một JWT token thời hạn ngắn (15 phút)
        String resetToken = jwtService.generateResetPasswordToken(email);

        // Gửi email thực tế chứa link reset
        emailService.sendResetPasswordEmail(user.getEmail(), resetToken);
    }

    // Đặt lại mật khẩu
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // 1. Lấy email từ token (jwtService tự kiểm tra token hết hạn chưa)
        String email;
        try {
            email = jwtService.extractEmail(token);
        } catch (Exception e) {
            throw new RuntimeException("Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
        }

        if (!jwtService.isResetPasswordTokenValid(token, email)) {
            throw new RuntimeException("Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạnn");
        }

        // 2. Tìm user
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Không tìm thấy người dùng");
        }

        // 3. Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}