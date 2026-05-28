package com.springboot.music.controller;

import com.springboot.music.dto.*;
import com.springboot.music.entity.User;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.responsemodel.ArtistLicensePageResponse;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import com.springboot.music.responsemodel.TransactionPageResponse;
import com.springboot.music.service.ArtistService;
import com.springboot.music.service.AudioTrackService;
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
    private final AudioTrackService audioTrackService;

    public ArtistController(ArtistService artistService, CertificateService certificateService, UserRepository userRepository, AudioTrackService audioTrackService) {
        this.artistService = artistService;
        this.certificateService = certificateService;
        this.userRepository = userRepository;
        this.audioTrackService = audioTrackService;
    }

    @GetMapping
    public ResponseEntity<List<ArtistDTO>> getAllArtists() {
        return ResponseEntity.ok(artistService.getAllArtists());
    }

    // ------------------------------ Dashboard & Thống kê -----------------------------

    @GetMapping("/me/dashboard/summary")
    @Operation(summary = "Lấy dữ liệu tổng quan cho trang Dashboard chính của Nghệ sĩ")
    public ResponseEntity<ArtistDashboardSummaryDTO> getDashboardSummary(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(artistService.getDashboardSummary(email));
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

    // ------------------------------ Quản lý nhạc -----------------------------

    @GetMapping("/me/tracks")
    @Operation(summary = "Lấy danh sách track của nghệ sĩ đang đăng nhập")
    public ResponseEntity<AudioTrackPageResponse> getMyTracks(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String genreName,
            @RequestParam(required = false, defaultValue = "all") String status) {

        String email = authentication.getName();
        return ResponseEntity.ok(artistService.getMyTracks(email, page, size, keyword, genreName, status));
    }

    @PutMapping("/me/tracks/{id}/resubmit")
    @Operation(summary = "Gửi duyệt lại bài hát", description = "Sau khi chỉnh sửa nội dung/file, artist gọi API này để chuyển trạng thái từ Need Revision về Pending.")
    public ResponseEntity<AudioTrackDTO> resubmitAudioTrack(@PathVariable Integer id) {
        return ResponseEntity.ok(audioTrackService.resubmitAudioTrack(id));
    }

    // api cho upload nhạc, update, delete ở class AudioTrackService

    // ------------------------------ Quản lý giấy phép -----------------------------

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

}