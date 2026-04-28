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
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/audio-tracks/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/audio-tracks/*/preview-play").permitAll()
                        .requestMatchers(HttpMethod.POST, "/audio-tracks/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/audio-tracks/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/audio-tracks/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/reviews/audio-tracks/*").permitAll()
                        .requestMatchers("/artists/**").permitAll()
                        .requestMatchers("/genres/**").permitAll()
                        .requestMatchers("/moods/**").permitAll()
                        .requestMatchers("/themes/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/orders/vnpay/return", "/orders/vnpay/return").permitAll()
                        .requestMatchers("/cart/**", "/orders/checkout").authenticated()
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