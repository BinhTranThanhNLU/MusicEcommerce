package com.springboot.music.controller;

import com.springboot.music.dto.AccountOrderDTO;
import com.springboot.music.dto.LibraryItemDTO;
import com.springboot.music.dto.UserDTO;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.service.CertificateService;
import com.springboot.music.service.DigitalWatermarkService;
import com.springboot.music.service.UserService;
import com.springboot.music.requestmodel.UpdateProfileRequest;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final CertificateService certificateService;
    private final DigitalWatermarkService digitalWatermarkService;

    public UserController(UserService userService, UserRepository userRepository, CertificateService certificateService, DigitalWatermarkService digitalWatermarkService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.certificateService = certificateService;
        this.digitalWatermarkService = digitalWatermarkService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        UserDTO user = userService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        UserDTO user = userService.updateCurrentUser(authentication.getName(), request);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/library")
    public ResponseEntity<List<LibraryItemDTO>> getUserLibrary(Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<LibraryItemDTO> libraryItems = userService.getUserLibrary(user.getId());
        return ResponseEntity.ok(libraryItems);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<AccountOrderDTO>> getUserOrders(Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<AccountOrderDTO> orders = userService.getUserOrders(user.getId());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/library/{orderDetailId}/download")
    public ResponseEntity<byte[]> downloadMusic(
            @PathVariable Integer orderDetailId,
            @RequestParam(name = "variant", required = false) String variant,
            Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 1. Lấy thông tin URL và Watermark ID từ service
        UserService.DownloadableMusic downloadableMusic = userService.resolveDownload(user.getId(), orderDetailId, variant);

        // 2. Gọi hàm nhúng Watermark (Gắn ID vào thẳng file nhạc)
        byte[] fileContent = digitalWatermarkService.injectWatermark(
                downloadableMusic.fileUrl(),
                downloadableMusic.watermarkId(),
                user.getEmail()
        );

        // 3. Trả file MP3 về cho trình duyệt để tự động tải xuống
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.valueOf("audio/mpeg"));
        headers.setContentDisposition(org.springframework.http.ContentDisposition.attachment()
                .filename(downloadableMusic.fileName(), java.nio.charset.StandardCharsets.UTF_8)
                .build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(fileContent);
    }

    @GetMapping("/library/{orderDetailId}/certificate")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Integer orderDetailId,
            Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CertificateService.GeneratedCertificate certificate = certificateService.generateCertificate(user, orderDetailId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(certificate.filename(), StandardCharsets.UTF_8)
                .build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(certificate.content());
    }

}
