package com.springboot.music.controller;

import com.springboot.music.dto.ArtistDTO;
import com.springboot.music.dto.ArtistDashboardSummaryDTO;
import com.springboot.music.dto.ArtistLicenseStatsDTO;
import com.springboot.music.dto.ArtistRevenueSummaryDTO;
import com.springboot.music.entity.User;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.responsemodel.ArtistLicensePageResponse;
import com.springboot.music.responsemodel.TransactionPageResponse;
import com.springboot.music.service.ArtistService;
import com.springboot.music.service.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/artists")
@Tag(name = "Artists", description = "Các API liên quan đến nghệ sĩ")
public class ArtistController {

    private final ArtistService artistService;
    private final CertificateService certificateService;
    private final UserRepository userRepository;

    public ArtistController(ArtistService artistService, CertificateService certificateService, UserRepository userRepository) {
        this.artistService = artistService;
        this.certificateService = certificateService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ArtistDTO>> getAllArtists() {
        return ResponseEntity.ok(artistService.getAllArtists());
    }

    @GetMapping("/me/licenses")
    @Operation(summary = "Lấy danh sách giấy phép đã bán của nghệ sĩ đang đăng nhập")
    public ResponseEntity<ArtistLicensePageResponse> getMyLicenses(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String licenseType,
            @RequestParam(required = false) String status) {

        String email = authentication.getName();
        ArtistLicensePageResponse response = artistService.getArtistLicenses(email, page, size, search, licenseType, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/licenses/stats")
    @Operation(summary = "Lấy thống kê nhanh về giấy phép của nghệ sĩ")
    public ResponseEntity<ArtistLicenseStatsDTO> getMyLicenseStats(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(artistService.getArtistLicenseStats(email));
    }

    @GetMapping("/me/licenses/{orderDetailId}/certificate")
    @Operation(summary = "Tải bản sao chứng chỉ PDF (Dành cho Nghệ sĩ)")
    public ResponseEntity<byte[]> downloadCertificateForArtist(
            @PathVariable Integer orderDetailId,
            Authentication authentication) {

        String email = authentication.getName();
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CertificateService.GeneratedCertificate certificate = certificateService.generateCertificateForArtist(artist, orderDetailId);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDisposition(org.springframework.http.ContentDisposition.attachment()
                .filename(certificate.filename(), java.nio.charset.StandardCharsets.UTF_8)
                .build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(certificate.content());
    }

    @GetMapping("/me/revenue/summary")
    @Operation(summary = "Lấy dữ liệu tổng quan cho trang Dashboard Doanh thu của Nghệ sĩ")
    public ResponseEntity<ArtistRevenueSummaryDTO> getMyRevenueSummary(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(artistService.getArtistRevenueSummary(email));
    }

    @GetMapping("/me/transactions")
    @Operation(summary = "Lấy lịch sử giao dịch của nghệ sĩ (có phân trang)")
    public ResponseEntity<TransactionPageResponse> getMyTransactions(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String email = authentication.getName();
        return ResponseEntity.ok(artistService.getArtistTransactions(email, page, size));
    }

    @GetMapping("/me/dashboard/summary")
    @Operation(summary = "Lấy dữ liệu tổng quan cho trang Dashboard chính của Nghệ sĩ")
    public ResponseEntity<ArtistDashboardSummaryDTO> getDashboardSummary(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(artistService.getDashboardSummary(email));
    }
}