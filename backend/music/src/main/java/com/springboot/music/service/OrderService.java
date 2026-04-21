package com.springboot.music.service;

import com.springboot.music.entity.*;
import com.springboot.music.repository.*;
import com.springboot.music.requestmodel.CheckoutRequest;
import com.springboot.music.responsemodel.CheckoutResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

        private final UserRepository userRepository;
        private final CartRepository cartRepository;
        private final CartItemRepository cartItemRepository;
        private final AudioTrackLicenseRepository audioTrackLicenseRepository;
        private final OrderRepository orderRepository;
        private final OrderDetailRepository orderDetailRepository;

    public OrderService(UserRepository userRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        AudioTrackLicenseRepository audioTrackLicenseRepository,
                        OrderRepository orderRepository,
                        OrderDetailRepository orderDetailRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.audioTrackLicenseRepository = audioTrackLicenseRepository;
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
    }


    @Transactional
    public CheckoutResponse checkout(String email, CheckoutRequest request) {
        User user = Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        List<CartItem> items = cart.getItems();
        if (items == null || items.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = 0.0;
        List<OrderDetail> orderDetails = new ArrayList<>();

        for (CartItem item : items) {
            AudioTrackLicenseId pairId = new AudioTrackLicenseId(
                    item.getAudioTrack().getId(),
                    item.getLicense().getId()
            );
            AudioTrackLicense trackLicense = audioTrackLicenseRepository.findById(pairId)
                    .orElseThrow(() -> new RuntimeException("Invalid license data for cart item"));

            double itemPrice = Optional.ofNullable(trackLicense.getPrice()).orElse(0.0);
            totalAmount += itemPrice;

            orderDetails.add(OrderDetail.builder()
                    .audioTrack(item.getAudioTrack())
                    .license(item.getLicense())
                    .price(itemPrice)
                    .build());
        }

        LocalDateTime now = LocalDateTime.now();
        String paymentMethod = (request != null && request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank())
                ? request.getPaymentMethod().trim()
                : "COD";

        OrderEntity order = OrderEntity.builder()
                .user(user)
                .totalAmount(totalAmount)
                .paymentStatus("COMPLETED")
                .createdAt(now)
                .build();

        OrderEntity savedOrder = orderRepository.save(order);

        for (OrderDetail detail : orderDetails) {
            detail.setOrder(savedOrder);
        }
        orderDetailRepository.saveAll(orderDetails);

        cartItemRepository.deleteByCart_Id(cart.getId());
        cartRepository.deleteById(cart.getId());

        return CheckoutResponse.builder()
                .orderId(savedOrder.getId())
                .paymentStatus(savedOrder.getPaymentStatus())
                .paymentMethod(paymentMethod)
                .totalItems(orderDetails.size())
                .totalAmount(totalAmount)
                .createdAt(now)
                .message("Thanh toan thanh cong")
                .build();
    }

}
