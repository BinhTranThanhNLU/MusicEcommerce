package com.springboot.music.service;

import com.springboot.music.dto.AccountOrderDTO;
import com.springboot.music.dto.AccountOrderItemDTO;
import com.springboot.music.dto.AdminUserDTO;
import com.springboot.music.dto.AdminUserDetailDTO;
import com.springboot.music.dto.AdminOrderDTO;
import com.springboot.music.dto.AdminOrderDetailDTO;
import com.springboot.music.dto.AdminOrderWithDetailsDTO;
import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.License;
import com.springboot.music.entity.OrderDetail;
import com.springboot.music.entity.OrderEntity;
import com.springboot.music.entity.PaymentTransaction;
import com.springboot.music.entity.User;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.mapper.UserMapper;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.OrderRepository;
import com.springboot.music.repository.PaymentTransactionRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.responsemodel.AdminUserPageResponse;
import com.springboot.music.responsemodel.AdminUserOrderPageResponse;
import com.springboot.music.responsemodel.AdminUserTrackPageResponse;
import com.springboot.music.responsemodel.AdminOrderPageResponse;
import com.springboot.music.requestmodel.UpdateOrderStatusRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    private static final String ROLE_ARTIST = "artist";
    private static final String ORDER_STATUS_PENDING = "PENDING";
    private static final String ORDER_STATUS_COMPLETED = "COMPLETED";
    private static final String ORDER_STATUS_FAILED = "FAILED";

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackMapper audioTrackMapper;

    public AdminService(UserRepository userRepository,
                        UserMapper userMapper,
                        OrderRepository orderRepository,
                        PaymentTransactionRepository paymentTransactionRepository,
                        AudioTrackRepository audioTrackRepository,
                        AudioTrackMapper audioTrackMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.orderRepository = orderRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackMapper = audioTrackMapper;
    }

    @Transactional(readOnly = true)
    public AdminUserPageResponse getUsers(int page, int size, String keyword, String role, Boolean isActive) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Chuẩn hóa param để truyền vào query
        String safeKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        String safeRole = (role != null && !role.equals("all")) ? role.trim() : null;

        Page<User> userPage = userRepository.findUsersByAdminFilter(safeKeyword, safeRole, isActive, pageable);

        // Map list User sang list AdminUserDTO
        List<AdminUserDTO> userDTOs = userMapper.toDtoList(userPage.getContent());

        return AdminUserPageResponse.builder()
                .users(userDTOs)
                .currentPage(userPage.getNumber())
                .totalPages(userPage.getTotalPages())
                .totalItems(userPage.getTotalElements())
                .build();
    }

    @Transactional
    public void toggleUserStatus(Integer userId, boolean status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        // Không cho phép Admin tự khóa chính mình
        if (user.getRole().getName().equals("admin") && !status) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể khóa tài khoản quản trị viên khác");
        }

        user.setIsActive(status);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public AdminUserDetailDTO getUserDetail(Integer userId) {
        User user = getUserByIdOrThrow(userId);

        return userMapper.toAdminDetailDto(user);
    }

    @Transactional(readOnly = true)
    public AdminUserOrderPageResponse getUserOrders(Integer userId, int page, int size) {
        validatePagination(page, size);
        User user = getUserByIdOrThrow(userId);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<OrderEntity> orderPage = orderRepository.findByUserId(user.getId(), pageable);
        List<AccountOrderDTO> orders = orderPage.getContent().stream()
                .map(this::toAccountOrderDto)
                .toList();

        return AdminUserOrderPageResponse.builder()
                .orders(orders)
                .currentPage(orderPage.getNumber())
                .totalPages(orderPage.getTotalPages())
                .totalItems(orderPage.getTotalElements())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminUserTrackPageResponse getUserTracks(Integer userId, int page, int size) {
        validatePagination(page, size);
        User user = getUserByIdOrThrow(userId);

        if (user.getRole() == null || user.getRole().getName() == null
                || !ROLE_ARTIST.equalsIgnoreCase(user.getRole().getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Người dùng này không phải artist");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("uploadDate").descending());
        Page<AudioTrack> trackPage = audioTrackRepository.findByArtistId(user.getId(), pageable);
        List<AudioTrackDTO> tracks = audioTrackMapper.toDtoList(trackPage.getContent());

        return AdminUserTrackPageResponse.builder()
                .tracks(tracks)
                .currentPage(trackPage.getNumber())
                .totalPages(trackPage.getTotalPages())
                .totalItems(trackPage.getTotalElements())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminOrderPageResponse getAllOrders(int page, int size, String paymentStatus) {
        validatePagination(page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<OrderEntity> orderPage = orderRepository.findAllWithFilter(paymentStatus, pageable);
        List<AdminOrderDTO> orders = orderPage.getContent().stream()
                .map(this::toAdminOrderDto)
                .toList();

        return AdminOrderPageResponse.builder()
                .orders(orders)
                .currentPage(orderPage.getNumber())
                .totalPages(orderPage.getTotalPages())
                .totalItems(orderPage.getTotalElements())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminOrderWithDetailsDTO getOrderDetail(Integer orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        PaymentTransaction transaction = paymentTransactionRepository.findByOrder_Id(orderId).orElse(null);
        List<AdminOrderDetailDTO> details = new ArrayList<>();

        if (order.getDetails() != null) {
            for (OrderDetail detail : order.getDetails()) {
                AudioTrack audioTrack = detail.getAudioTrack();
                User artist = audioTrack != null ? audioTrack.getArtist() : null;
                License license = detail.getLicense();

                details.add(AdminOrderDetailDTO.builder()
                        .orderDetailId(detail.getId())
                        .audioId(audioTrack != null ? audioTrack.getId() : null)
                        .trackTitle(audioTrack != null ? audioTrack.getTitle() : null)
                        .artistName(artist != null ? artist.getName() : "Unknown Artist")
                        .coverImage(audioTrack != null ? audioTrack.getCoverImage() : null)
                        .licenseType(license != null ? license.getLicenseType() : null)
                        .price(detail.getPrice())
                        .duration(audioTrack != null ? audioTrack.getDuration() : null)
                        .watermarkId(detail.getWatermarkId())
                        .expiredAt(detail.getExpiredAt())
                        .licenseStatus(detail.getLicenseStatus())
                        .build());
            }
        }

        User customer = order.getUser();
        return AdminOrderWithDetailsDTO.builder()
                .orderId(order.getId())
                .userId(customer.getId())
                .customerName(customer.getName())
                .customerEmail(customer.getEmail())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(transaction != null ? transaction.getPaymentMethod() : null)
                .gatewayTransactionCode(transaction != null ? transaction.getGatewayTransactionCode() : null)
                .createdAt(order.getCreatedAt())
                .totalItems(details.size())
                .items(details)
                .build();
    }

    @Transactional
    public String updateOrderStatus(Integer orderId, UpdateOrderStatusRequest request) {
        if (request == null || request.getStatus() == null || request.getStatus().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không được trống");
        }

        String newStatus = request.getStatus().trim().toUpperCase();
        if (!isValidOrderStatus(newStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ. Chỉ chấp nhận: PENDING, COMPLETED, FAILED");
        }

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        String oldStatus = order.getPaymentStatus();
        order.setPaymentStatus(newStatus);
        orderRepository.save(order);

        return "Cập nhật trạng thái từ " + oldStatus + " thành " + newStatus + " thành công";
    }

    private boolean isValidOrderStatus(String status) {
        return ORDER_STATUS_PENDING.equals(status)
                || ORDER_STATUS_COMPLETED.equals(status)
                || ORDER_STATUS_FAILED.equals(status);
    }

    private AdminOrderDTO toAdminOrderDto(OrderEntity order) {
        PaymentTransaction transaction = paymentTransactionRepository.findByOrder_Id(order.getId()).orElse(null);
        User customer = order.getUser();

        return AdminOrderDTO.builder()
                .orderId(order.getId())
                .userId(customer.getId())
                .customerName(customer.getName())
                .customerEmail(customer.getEmail())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(transaction != null ? transaction.getPaymentMethod() : null)
                .gatewayTransactionCode(transaction != null ? transaction.getGatewayTransactionCode() : null)
                .createdAt(order.getCreatedAt())
                .totalItems(order.getDetails() != null ? order.getDetails().size() : 0)
                .build();
    }

    private User getUserByIdOrThrow(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));
    }

    private void validatePagination(int page, int size) {
        if (page < 0 || size <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "page/size không hợp lệ");
        }
    }

    private AccountOrderDTO toAccountOrderDto(OrderEntity order) {
        PaymentTransaction transaction = paymentTransactionRepository.findByOrder_Id(order.getId()).orElse(null);
        List<AccountOrderItemDTO> items = new ArrayList<>();

        if (order.getDetails() != null) {
            for (OrderDetail detail : order.getDetails()) {
                var audioTrack = detail.getAudioTrack();
                License license = detail.getLicense();
                User artist = audioTrack != null ? audioTrack.getArtist() : null;

                items.add(AccountOrderItemDTO.builder()
                        .orderDetailId(detail.getId())
                        .audioId(audioTrack != null ? audioTrack.getId() : null)
                        .title(audioTrack != null ? audioTrack.getTitle() : null)
                        .audioType(audioTrack != null ? audioTrack.getAudioType() : null)
                        .artistName(artist != null ? artist.getName() : "Unknown Artist")
                        .coverImage(audioTrack != null ? audioTrack.getCoverImage() : null)
                        .licenseType(license != null ? license.getLicenseType() : null)
                        .price(detail.getPrice())
                        .duration(audioTrack != null ? audioTrack.getDuration() : null)
                        .reviewSubmitted(false)
                        .build());
            }
        }

        return AccountOrderDTO.builder()
                .orderId(order.getId())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(transaction != null ? transaction.getPaymentMethod() : null)
                .gatewayTransactionCode(transaction != null ? transaction.getGatewayTransactionCode() : null)
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .totalItems(items.size())
                .items(items)
                .build();
    }
}
