package com.springboot.music.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthFilter,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint
    ) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
                .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF vì dùng JWT
                .cors(cors -> cors.configure(http))    // Cấu hình CORS cho React gọi API không bị lỗi
                .authorizeHttpRequests(auth -> auth

                                // 1. NHÓM PUBLIC (Không cần đăng nhập)
                                .requestMatchers("/auth/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/audio-tracks/**", "/genres/**", "/moods/**", "/themes/**", "/artists/**", "/reviews/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/audio-tracks/*/preview-play").permitAll()
                                .requestMatchers("/orders/vnpay/return", "/orders/vnpay/ipn").permitAll() // Webhook cho cổng thanh toán
                                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/error").permitAll()

                                // 2. NHÓM ARTIST (Quyền Nghệ sĩ)
                                .requestMatchers(HttpMethod.POST, "/audio-tracks/**").hasAuthority("artist")
                                .requestMatchers(HttpMethod.PUT, "/audio-tracks/**").hasAuthority("artist")
                                .requestMatchers(HttpMethod.DELETE, "/audio-tracks/**").hasAuthority("artist")
                                // .requestMatchers("/artist/revenue/**").hasAuthority("artist") // Ví dụ API doanh thu

                                // 3. NHÓM ADMIN (Quyền Quản trị viên)
                                .requestMatchers("/v1/admin/**").permitAll()
                                .requestMatchers("/admin/**").hasAuthority("admin")
                                .requestMatchers(HttpMethod.POST, "/genres/**", "/moods/**", "/themes/**").hasAuthority("admin")
                                .requestMatchers(HttpMethod.PUT, "/genres/**", "/moods/**", "/themes/**").hasAuthority("admin")
                                .requestMatchers(HttpMethod.DELETE, "/genres/**", "/moods/**", "/themes/**").hasAuthority("admin")

                                // 4. NHÓM USER ĐÃ ĐĂNG NHẬP
                                .requestMatchers("/cart/**", "/orders/checkout", "/orders/history").authenticated()
                                .requestMatchers(HttpMethod.POST, "/reviews/**").authenticated()

                                // 5. An toàn mặc định
                                .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                // Không lưu session (Stateless) vì mỗi request đều có JWT rồi
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Chèn cái trạm gác cổng JWT của mình vào trước trạm gác mặc định của Spring
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}