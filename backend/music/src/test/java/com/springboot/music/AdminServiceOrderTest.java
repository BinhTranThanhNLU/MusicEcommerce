package com.springboot.music;

import com.springboot.music.dto.AdminUserDetailDTO;
import com.springboot.music.entity.OrderEntity;
import com.springboot.music.entity.Role;
import com.springboot.music.entity.User;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.mapper.UserMapper;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.OrderRepository;
import com.springboot.music.repository.PaymentTransactionRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.requestmodel.UpdateOrderStatusRequest;
import com.springboot.music.responsemodel.AdminOrderPageResponse;
import com.springboot.music.service.AdminService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceOrderTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentTransactionRepository paymentTransactionRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    void getUserDetail_shouldReturnUserDetailWhenUserExists() {
        Integer userId = 7;
        User user = User.builder()
                .id(userId)
                .email("user@test.com")
                .name("Test User")
                .role(Role.builder().name("customer").build())
                .build();

        AdminUserDetailDTO expected = AdminUserDetailDTO.builder()
                .id(userId)
                .email("user@test.com")
                .name("Test User")
                .role("customer")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userMapper.toAdminDetailDto(user)).thenReturn(expected);

        AdminUserDetailDTO actual = adminService.getUserDetail(userId);

        assertEquals(expected.getId(), actual.getId());
        assertEquals(expected.getEmail(), actual.getEmail());
        assertEquals(expected.getName(), actual.getName());
        assertEquals(expected.getRole(), actual.getRole());
    }

    @Test
    void getUserTracks_shouldThrowBadRequestWhenUserIsNotArtist() {
        Integer userId = 11;
        User user = User.builder()
                .id(userId)
                .role(Role.builder().name("customer").build())
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> adminService.getUserTracks(userId, 0, 10));

        assertEquals(HttpStatus.BAD_REQUEST.value(), ex.getStatusCode().value());
    }

    @Test
    void getUserOrders_shouldThrowBadRequestWhenPaginationInvalid() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> adminService.getUserOrders(1, -1, 10));

        assertEquals(HttpStatus.BAD_REQUEST.value(), ex.getStatusCode().value());
    }

    @Test
    void getAllOrders_shouldReturnPagedOrders() {
        User customer = User.builder()
                .id(1)
                .name("John Doe")
                .email("john@test.com")
                .build();

        OrderEntity order = OrderEntity.builder()
                .id(100)
                .user(customer)
                .totalAmount(500.0)
                .paymentStatus("COMPLETED")
                .createdAt(LocalDateTime.now())
                .details(List.of())
                .build();

        Pageable pageable = Pageable.ofSize(10).withPage(0);
        Page<OrderEntity> orderPage = new PageImpl<>(
                List.of(order),
                pageable,
                1
        );

        when(orderRepository.findAllWithFilter(null, pageable)).thenReturn(orderPage);
        when(paymentTransactionRepository.findByOrder_Id(100)).thenReturn(Optional.empty());

        AdminOrderPageResponse result = adminService.getAllOrders(0, 10, null);

        assertEquals(1, result.getOrders().size());
        assertEquals(100, result.getOrders().get(0).getOrderId());
        assertEquals(1, result.getTotalItems());
    }

    @Test
    void getOrderDetail_shouldThrowNotFoundWhenOrderMissing() {
        when(orderRepository.findById(999)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> adminService.getOrderDetail(999));

        assertEquals(HttpStatus.NOT_FOUND.value(), ex.getStatusCode().value());
    }

    @Test
    void updateOrderStatus_shouldUpdateSuccessfully() {
        User customer = User.builder()
                .id(1)
                .name("John Doe")
                .email("john@test.com")
                .build();

        OrderEntity order = OrderEntity.builder()
                .id(100)
                .user(customer)
                .totalAmount(500.0)
                .paymentStatus("PENDING")
                .createdAt(LocalDateTime.now())
                .details(List.of())
                .build();

        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest("COMPLETED");

        when(orderRepository.findById(100)).thenReturn(Optional.of(order));

        String result = adminService.updateOrderStatus(100, request);

        assertEquals("Cập nhật trạng thái từ PENDING thành COMPLETED thành công", result);
        ArgumentCaptor<OrderEntity> captor = ArgumentCaptor.forClass(OrderEntity.class);
        verify(orderRepository).save(captor.capture());
        assertEquals("COMPLETED", captor.getValue().getPaymentStatus());
    }

    @Test
    void updateOrderStatus_shouldThrowBadRequestForInvalidStatus() {
        User customer = User.builder().id(1).build();
        OrderEntity order = OrderEntity.builder()
                .id(100)
                .user(customer)
                .paymentStatus("PENDING")
                .build();

        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest("INVALID_STATUS");

        when(orderRepository.findById(100)).thenReturn(Optional.of(order));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> adminService.updateOrderStatus(100, request));

        assertEquals(HttpStatus.BAD_REQUEST.value(), ex.getStatusCode().value());
    }
}



