package com.springboot.music.service;

import com.springboot.music.dto.LibraryItemDTO;
import com.springboot.music.entity.*;
import com.springboot.music.repository.*;
import com.springboot.music.requestmodel.CheckoutRequest;
import com.springboot.music.responsemodel.CheckoutResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OrderService {

    private static final String PAYMENT_METHOD_COD = "COD";
    private static final String PAYMENT_METHOD_VNPAY = "VNPAY";
    private static final String PAYMENT_METHOD_MOMO = "MOMO";

    private static final String ORDER_STATUS_PENDING = "PENDING";
    private static final String ORDER_STATUS_COMPLETED = "COMPLETED";
    private static final String ORDER_STATUS_FAILED = "FAILED";

    private static final String TX_STATUS_PENDING = "PENDING";
    private static final String TX_STATUS_SUCCESS = "SUCCESS";
    private static final String TX_STATUS_FAILED = "FAILED";

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AudioTrackLicenseRepository audioTrackLicenseRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final VnPayService vnPayService;

    public OrderService(UserRepository userRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        AudioTrackLicenseRepository audioTrackLicenseRepository,
                        OrderRepository orderRepository,
                        OrderDetailRepository orderDetailRepository,
                        PaymentTransactionRepository paymentTransactionRepository,
                        VnPayService vnPayService) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.audioTrackLicenseRepository = audioTrackLicenseRepository;
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.vnPayService = vnPayService;
    }

    @Transactional
    public CheckoutResponse checkout(String email, CheckoutRequest request, HttpServletRequest httpRequest) {
        User user = Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        String paymentMethod = normalizePaymentMethod(request == null ? null : request.getPaymentMethod());
        if (!isSupportedPaymentMethod(paymentMethod)) {
            throw new RuntimeException("Phương thức thanh toán chưa được hỗ trợ: " + paymentMethod);
        }
        if (PAYMENT_METHOD_MOMO.equals(paymentMethod)) {
            throw new RuntimeException("MoMo chưa được tích hợp. Hiện tại chỉ hỗ trợ VNPay hoặc COD.");
        }

        boolean isVnPay = PAYMENT_METHOD_VNPAY.equals(paymentMethod);
        CheckoutContext context = createOrderFromCart(user, cart, isVnPay ? ORDER_STATUS_PENDING : ORDER_STATUS_COMPLETED);

        PaymentTransaction paymentTransaction = paymentTransactionRepository.save(
                PaymentTransaction.builder()
                        .order(context.order())
                        .paymentMethod(paymentMethod)
                        .gatewayTransactionCode(isVnPay ? null : "COD-" + context.order().getId())
                        .amount(context.totalAmount())
                        .transactionDate(context.now())
                        .status(isVnPay ? TX_STATUS_PENDING : TX_STATUS_SUCCESS)
                        .build()
        );

        String paymentUrl = null;
        String message = "Thanh toán thành công";

        if (isVnPay) {
            paymentUrl = vnPayService.createPaymentUrl(context.order(), httpRequest);
            message = "Đang chuyển đến cổng thanh toán VNPay";
        } else {
            clearCart(cart);
        }

        return CheckoutResponse.builder()
                .orderId(context.order().getId())
                .paymentStatus(context.order().getPaymentStatus())
                .paymentMethod(paymentMethod)
                .gatewayTransactionCode(paymentTransaction.getGatewayTransactionCode())
                .totalItems(context.totalItems())
                .totalAmount(context.totalAmount())
                .createdAt(context.now())
                .paymentUrl(paymentUrl)
                .message(message)
                .build();
    }

    @Transactional
    public String handleVnPayReturn(Map<String, String> params) {
        if (!vnPayService.verifyReturn(params)) {
            throw new RuntimeException("VNPay signature is invalid");
        }

        String txnRef = params.get("vnp_TxnRef");
        if (txnRef == null || txnRef.isBlank()) {
            throw new RuntimeException("VNPay response is missing txnRef");
        }

        Integer orderId = Integer.valueOf(txnRef);
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        PaymentTransaction paymentTransaction = paymentTransactionRepository.findByOrder_Id(orderId)
                .orElseThrow(() -> new RuntimeException("Payment transaction not found"));

        String responseCode = Optional.ofNullable(params.get("vnp_ResponseCode")).orElse("");
        String transactionStatus = Optional.ofNullable(params.get("vnp_TransactionStatus")).orElse("");
        String gatewayTransactionCode = Optional.ofNullable(params.get("vnp_TransactionNo")).orElse(params.get("vnp_TransactionRef"));

        boolean isSuccess = "00".equals(responseCode) && (transactionStatus.isBlank() || "00".equals(transactionStatus));

        if (isSuccess) {
            order.setPaymentStatus(ORDER_STATUS_COMPLETED);
            paymentTransaction.setStatus(TX_STATUS_SUCCESS);
            paymentTransaction.setGatewayTransactionCode(gatewayTransactionCode);
            paymentTransaction.setTransactionDate(LocalDateTime.now());
            orderRepository.save(order);
            paymentTransactionRepository.save(paymentTransaction);

            clearCartByUserId(order.getUser().getId());

            return buildFrontendRedirect("success", orderId, "VNPay thanh toán thành công");
        }

        order.setPaymentStatus(ORDER_STATUS_FAILED);
        paymentTransaction.setStatus(TX_STATUS_FAILED);
        paymentTransaction.setGatewayTransactionCode(gatewayTransactionCode);
        paymentTransaction.setTransactionDate(LocalDateTime.now());
        orderRepository.save(order);
        paymentTransactionRepository.save(paymentTransaction);

        return buildFrontendRedirect("failed", orderId, "VNPay thanh toán thất bại");
    }

    private CheckoutContext createOrderFromCart(User user, Cart cart, String orderStatus) {
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
        OrderEntity order = orderRepository.save(OrderEntity.builder()
                .user(user)
                .totalAmount(totalAmount)
                .paymentStatus(orderStatus)
                .createdAt(now)
                .build());

        for (OrderDetail detail : orderDetails) {
            detail.setOrder(order);
        }
        orderDetailRepository.saveAll(orderDetails);

        return new CheckoutContext(order, totalAmount, orderDetails.size(), now);
    }

    private void clearCart(Cart cart) {
        cartItemRepository.deleteByCart_Id(cart.getId());
        cartRepository.deleteById(cart.getId());
    }

    private void clearCartByUserId(Integer userId) {
        cartRepository.findByUser_Id(userId).ifPresent(this::clearCart);
    }

    private String normalizePaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isBlank()) {
            return PAYMENT_METHOD_COD;
        }
        return paymentMethod.trim().toUpperCase();
    }

    private boolean isSupportedPaymentMethod(String paymentMethod) {
        return PAYMENT_METHOD_COD.equals(paymentMethod)
                || PAYMENT_METHOD_VNPAY.equals(paymentMethod)
                || PAYMENT_METHOD_MOMO.equals(paymentMethod);
    }

    private String buildFrontendRedirect(String paymentState, Integer orderId, String message) {
        return vnPayService.getFrontendCheckoutUrl() + "?payment=" + paymentState + "&orderId=" + orderId + "&message=" + encodeQuery(message);
    }

    private String encodeQuery(String value) {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20");
    }

    private record CheckoutContext(OrderEntity order, double totalAmount, int totalItems, LocalDateTime now) {
    }

//    public List<LibraryItemDTO> getUserLibrary(Integer userId) {
//        List<OrderDetail> orderDetails = orderDetailRepository.findByUserIdAndOrderCompleted(userId);
//        List<LibraryItemDTO> libraryItems = new ArrayList<>();
//
//        for (OrderDetail detail : orderDetails) {
//            AudioTrack audioTrack = detail.getAudioTrack();
//            User artist = audioTrack.getArtist();
//            License license = detail.getLicense();
//
//            LibraryItemDTO item = LibraryItemDTO.builder()
//                    .audioId(audioTrack.getId())
//                    .title(audioTrack.getTitle())
//                    .audioType(audioTrack.getAudioType())
//                    .artistName(artist != null ? artist.getName() : "Unknown Artist")
//                    .coverImage(audioTrack.getCoverImage())
//                    .licenseType(license.getLicenseType())
//                    .originalFileUrl(audioTrack.getOriginalFileUrl())
//                    .watermarkedFileUrl(audioTrack.getWatermarkedFileUrl())
//                    .duration(audioTrack.getDuration())
//                    .purchasedAt(detail.getOrder().getCreatedAt())
//                    .orderId(detail.getOrder().getId())
//                    .orderDetailId(detail.getId())
//                    .build();
//
//            libraryItems.add(item);
//        }
//
//        return libraryItems;
//    }
}
