package com.springboot.music.controller;

import com.springboot.music.dto.LibraryItemDTO;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.service.CertificateService;
import com.springboot.music.service.UserService;
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

    public UserController(UserService userService, UserRepository userRepository, CertificateService certificateService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.certificateService = certificateService;
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

    @GetMapping("/library/{orderDetailId}/download")
    public ResponseEntity<Void> downloadMusic(
            @PathVariable Integer orderDetailId,
            @RequestParam(name = "variant", required = false) String variant,
            Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserService.DownloadableMusic downloadableMusic = userService.resolveDownload(user.getId(), orderDetailId, variant);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(downloadableMusic.fileUrl()));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(downloadableMusic.fileName(), StandardCharsets.UTF_8)
                .build());

        return ResponseEntity.status(HttpStatus.FOUND)
                .headers(headers)
                .build();
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
