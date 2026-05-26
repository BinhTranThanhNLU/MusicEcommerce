package com.springboot.music.controller;

import com.springboot.music.dto.AdminUserDetailDTO;
import com.springboot.music.dto.AdminLicenseDTO;
import com.springboot.music.responsemodel.AdminUserPageResponse;
import com.springboot.music.responsemodel.AdminUserOrderPageResponse;
import com.springboot.music.responsemodel.AdminUserTrackPageResponse;
import com.springboot.music.dto.AdminOrderWithDetailsDTO;
import com.springboot.music.dto.AdminDashboardOverviewDTO;
import com.springboot.music.dto.AdminTopTrackDTO;
import com.springboot.music.responsemodel.AdminOrderPageResponse;
import com.springboot.music.responsemodel.AdminLicensePageResponse;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import com.springboot.music.requestmodel.UpdateOrderStatusRequest;
import com.springboot.music.requestmodel.UpdateCopyrightRequest;
import com.springboot.music.requestmodel.ModerateAudioTrackRequest;
import com.springboot.music.responsemodel.CopyrightPageResponse;
import com.springboot.music.dto.CopyrightInfoDTO;
import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/admin")
@Tag(name = "Admin", description = "Các API dành riêng cho Quản trị viên")
@Validated
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ------------------------------ Quản lý giấy phép -----------------------------

    @PutMapping("/licenses/{orderDetailId}/revoke")
    @Operation(summary = "Thu hồi giấy phép của một order detail")
    public ResponseEntity<String> revokeLicense(@PathVariable @Positive Integer orderDetailId) {
        return ResponseEntity.ok(adminService.revokeLicense(orderDetailId));
    }

    @GetMapping("/licenses")
    @Operation(summary = "Lấy danh sách giấy phép của toàn hệ thống (có phân trang & lọc)")
    public ResponseEntity<AdminLicensePageResponse> getAllLicenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "all") String licenseType,
            @RequestParam(required = false, defaultValue = "all") String status) {

        return ResponseEntity.ok(adminService.getLicenses(page, size, search, licenseType, status));
    }

    @GetMapping("/licenses/{orderDetailId}")
    @Operation(summary = "Lấy chi tiết một giấy phép theo order detail ID")
    public ResponseEntity<AdminLicenseDTO> getLicenseDetail(@PathVariable @Positive Integer orderDetailId) {
        return ResponseEntity.ok(adminService.getLicenseDetail(orderDetailId));
    }

    // ------------------------------ Kiểm duyệt nhạc -----------------------------
    @GetMapping("/tracks/pending")
    @Operation(summary = "Lấy danh sách bài hát đang chờ duyệt")
    public ResponseEntity<AudioTrackPageResponse> getPendingTracks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getPendingTracks(page, size));
    }

    @GetMapping("/tracks/{id}")
    @Operation(summary = "Lấy chi tiết bài hát để kiểm duyệt")
    public ResponseEntity<AudioTrackDTO> getTrackModerationDetail(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(adminService.getTrackModerationDetail(id));
    }

    @PutMapping("/tracks/{id}/approve")
    @Operation(summary = "Duyệt bài hát")
    public ResponseEntity<AudioTrackDTO> approveTrack(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(adminService.approveTrack(id));
    }

    @PutMapping("/tracks/{id}/reject")
    @Operation(summary = "Từ chối bài hát")
    public ResponseEntity<AudioTrackDTO> rejectTrack(
            @PathVariable @Positive Integer id,
            @RequestBody ModerateAudioTrackRequest request) {
        return ResponseEntity.ok(adminService.rejectTrack(id, request));
    }

    @PutMapping("/tracks/{id}/need-revision")
    @Operation(summary = "Yêu cầu chỉnh sửa bài hát")
    public ResponseEntity<AudioTrackDTO> requestRevision(
            @PathVariable @Positive Integer id,
            @RequestBody ModerateAudioTrackRequest request) {
        return ResponseEntity.ok(adminService.requestRevision(id, request));
    }

    // ------------------------------ Quản lý User -----------------------------

    @GetMapping("/users")
    @Operation(summary = "Lấy danh sách người dùng (có phân trang & bộ lọc)")
    public ResponseEntity<AdminUserPageResponse> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "all") String role,
            @RequestParam(required = false) Boolean isActive) {

        AdminUserPageResponse result = adminService.getUsers(page, size, keyword, role, isActive);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/users/{id}/lock")
    @Operation(summary = "Khóa hoặc Mở khóa tài khoản người dùng")
    public ResponseEntity<String> toggleUserStatus(
            @PathVariable Integer id,
            @RequestParam boolean isActive) {

        adminService.toggleUserStatus(id, isActive);
        return ResponseEntity.ok(isActive ? "Đã mở khóa tài khoản thành công" : "Đã khóa tài khoản thành công");
    }

    @GetMapping("/users/{id}/detail")
    @Operation(summary = "Lấy chi tiết người dùng theo ID")
    public ResponseEntity<AdminUserDetailDTO> getUserDetail(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(adminService.getUserDetail(id));
    }

    @GetMapping({"/users/{id}/orders", "/users/{id}/transactions"})
    @Operation(summary = "Lấy lịch sử đơn hàng/giao dịch của người dùng theo ID")
    public ResponseEntity<AdminUserOrderPageResponse> getUserOrders(
            @PathVariable @Positive Integer id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getUserOrders(id, page, size));
    }

    @GetMapping("/users/{id}/tracks")
    @Operation(summary = "Lấy danh sách tác phẩm của người dùng theo ID (chỉ áp dụng cho artist)")
    public ResponseEntity<AdminUserTrackPageResponse> getUserTracks(
            @PathVariable @Positive Integer id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getUserTracks(id, page, size));
    }

    // ------------------------------ Quản lý Audio Track -----------------------------

    @GetMapping("/audio-tracks")
    @Operation(summary = "Lấy danh sách toàn bộ audio track (có phân trang & lọc)")
    public ResponseEntity<AudioTrackPageResponse> getAllAudioTracks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String audioType,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminService.getAllAudioTracks(page, size, title, audioType, status));
    }

    @GetMapping("/audio-tracks/{id}")
    @Operation(summary = "Lấy chi tiết một audio track")
    public ResponseEntity<AudioTrackDTO> getAudioTrackDetail(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(adminService.getAudioTrackDetail(id));
    }

    @DeleteMapping("/audio-tracks/{id}")
    @Operation(summary = "Xóa mềm một audio track (không xóa hoàn toàn từ database)")
    public ResponseEntity<String> softDeleteAudioTrack(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(adminService.softDeleteAudioTrack(id));
    }

    @PutMapping("/audio-tracks/{id}/restore")
    @Operation(summary = "Khôi phục một audio track đã bị xóa")
    public ResponseEntity<String> restoreAudioTrack(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(adminService.restoreAudioTrack(id));
    }

    // ------------------------------ Quản lý Đơn hàng -----------------------------

    @GetMapping("/orders")
    @Operation(summary = "Lấy danh sách tất cả đơn hàng (có phân trang & bộ lọc)")
    public ResponseEntity<AdminOrderPageResponse> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String paymentStatus) {
        return ResponseEntity.ok(adminService.getAllOrders(page, size, paymentStatus));
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Lấy chi tiết đơn hàng theo ID")
    public ResponseEntity<AdminOrderWithDetailsDTO> getOrderDetail(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(adminService.getOrderDetail(id));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Cập nhật trạng thái đơn hàng")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable @Positive Integer id,
            @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(adminService.updateOrderStatus(id, request));
    }

    // ------------------------------ Quản lý bản quyền -----------------------------

    @GetMapping("/copyrights")
    @Operation(summary = "Lấy danh sách thông tin bản quyền (có phân trang & lọc)")
    public ResponseEntity<CopyrightPageResponse> getCopyrights(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer audioId,
            @RequestParam(required = false) String ownerName) {

        return ResponseEntity.ok(adminService.getCopyrights(page, size, audioId, ownerName));
    }

    @GetMapping("/copyrights/{id}")
    @Operation(summary = "Lấy chi tiết thông tin bản quyền theo ID")
    public ResponseEntity<CopyrightInfoDTO> getCopyrightDetail(@PathVariable @Positive Integer id) {
        return ResponseEntity.ok(adminService.getCopyrightDetail(id));
    }

    @PutMapping("/copyrights/{id}")
    @Operation(summary = "Cập nhật thông tin bản quyền")
    public ResponseEntity<CopyrightInfoDTO> updateCopyright(
            @PathVariable @Positive Integer id,
            @RequestBody UpdateCopyrightRequest request) {
        return ResponseEntity.ok(adminService.updateCopyright(id, request));
    }

    // ------------------------------ Dashboard & Thống kê -----------------------------

    @GetMapping("/dashboard/overview")
    @Operation(summary = "Lấy dữ liệu tổng quan dashboard của admin")
    public ResponseEntity<AdminDashboardOverviewDTO> getDashboardOverview(
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(defaultValue = "12") int points) {
        return ResponseEntity.ok(adminService.getDashboardOverview(period, points));
    }

    @GetMapping("/dashboard/top-selling")
    @Operation(summary = "Lấy danh sách bài hát/top bán chạy toàn nền tảng")
    public ResponseEntity<java.util.List<AdminTopTrackDTO>> getTopSellingTracks(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(adminService.getTopSellingTracks(limit));
    }


    @GetMapping("/transactions")
    @Operation(summary = "Lấy danh sách giao dịch thanh toán (có phân trang) - kèm doanh thu admin cho mỗi giao dịch")
    public ResponseEntity<com.springboot.music.responsemodel.AdminTransactionPageResponse> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllTransactions(page, size));
    }

}
