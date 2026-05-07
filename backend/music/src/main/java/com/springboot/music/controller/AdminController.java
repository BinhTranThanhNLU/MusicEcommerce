package com.springboot.music.controller;

import com.springboot.music.dto.AdminUserDetailDTO;
import com.springboot.music.responsemodel.AdminUserPageResponse;
import com.springboot.music.responsemodel.AdminUserOrderPageResponse;
import com.springboot.music.responsemodel.AdminUserTrackPageResponse;
import com.springboot.music.dto.AdminOrderWithDetailsDTO;
import com.springboot.music.responsemodel.AdminOrderPageResponse;
import com.springboot.music.requestmodel.UpdateOrderStatusRequest;
import com.springboot.music.requestmodel.UpdateCopyrightRequest;
import com.springboot.music.responsemodel.CopyrightPageResponse;
import com.springboot.music.dto.CopyrightInfoDTO;
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

    @PutMapping("/licenses/{orderDetailId}/revoke")
    @Operation(summary = "Thu hồi giấy phép của một order detail")
    public ResponseEntity<String> revokeLicense(@PathVariable @Positive Integer orderDetailId) {
        return ResponseEntity.ok(adminService.revokeLicense(orderDetailId));
    }

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
}
