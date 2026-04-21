package com.springboot.music.service;

import com.springboot.music.entity.*;
import com.springboot.music.repository.AudioTrackLicenseRepository;
import com.springboot.music.repository.CartItemRepository;
import com.springboot.music.repository.CartRepository;
import com.springboot.music.repository.OrderDetailRepository;
import com.springboot.music.repository.OrderRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.requestmodel.AddToCartRequest;
import com.springboot.music.requestmodel.CheckoutRequest;
import com.springboot.music.requestmodel.UpdateCartItemLicenseRequest;
import com.springboot.music.responsemodel.CartItemDetailResponse;
import com.springboot.music.responsemodel.CartItemResponse;
import com.springboot.music.responsemodel.CartResponse;
import com.springboot.music.responsemodel.CheckoutResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AudioTrackLicenseRepository audioTrackLicenseRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    public CartService(UserRepository userRepository,
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
    public CartItemResponse addToCart(String email, AddToCartRequest request) {
        // Tìm user từ email
        User user = Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra audio-track và license có tồn tại không
        AudioTrackLicenseId pairId = new AudioTrackLicenseId(request.getAudioId(), request.getLicenseId());
        AudioTrackLicense trackLicense = audioTrackLicenseRepository.findById(pairId)
                .orElseThrow(() -> new RuntimeException("Audio-track and license combination is invalid"));

        // Lấy hoặc tạo giỏ hàng của user
        Cart cart = cartRepository.findByUser_Id(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));

        // Kiểm tra item đã có trong giỏ không
        Optional<CartItem> existingItem = cartItemRepository.findByCart_IdAndAudioTrack_IdAndLicense_Id(
                cart.getId(), request.getAudioId(), request.getLicenseId()
        );

        if (existingItem.isPresent()) {
            // Nếu đã có thì trả về item cũ với flag alreadyInCart = true
            return toResponse(existingItem.get(), trackLicense.getPrice(), true);
        }

        // Nếu chưa có thì tạo mới
        CartItem newItem = CartItem.builder()
                .cart(cart)
                .audioTrack(trackLicense.getAudioTrack())
                .license(trackLicense.getLicense())
                .build();

        CartItem saved = cartItemRepository.save(newItem);
        return toResponse(saved, trackLicense.getPrice(), false);
    }

    /**
     * Lấy giỏ hàng của user
     */
    @Transactional(readOnly = true)
    public CartResponse getCart(String email) {
        User user = Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Cart> cartOptional = cartRepository.findByUser_Id(user.getId());
        if (cartOptional.isEmpty()) {
            return CartResponse.builder()
                    .cartId(null)
                    .userId(user.getId())
                    .items(List.of())
                    .totalPrice(0.0)
                    .totalItems(0)
                    .build();
        }
        Cart cart = cartOptional.get();

        // Tính tổng tiền
        List<CartItemDetailResponse> items = cart.getItems().stream()
                .map(item -> {
                    AudioTrackLicenseId id = new AudioTrackLicenseId(
                            item.getAudioTrack().getId(),
                            item.getLicense().getId()
                    );
                    AudioTrackLicense license = audioTrackLicenseRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("License not found"));
                    return toCartItemDetailResponse(item, license.getPrice());
                })
                .toList();

        Double totalPrice = items.stream()
                .mapToDouble(CartItemDetailResponse::getPrice)
                .sum();

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(user.getId())
                .items(items)
                .totalPrice(totalPrice)
                .totalItems(items.size())
                .build();
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    @Transactional
    public void removeFromCart(String email, Integer cartItemId) {
        User user = Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new RuntimeException("User not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Kiểm tra item này thuộc giỏ của user không
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: item does not belong to user");
        }

        cartItemRepository.delete(item);
    }

    /**
     * Xoa toan bo gio hang cua user
     */
    @Transactional
    public long deleteCart(String email) {
        User user = Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Cart> cartOptional = cartRepository.findByUser_Id(user.getId());
        if (cartOptional.isEmpty()) {
            return -1;
        }

        Cart cart = cartOptional.get();
        long deletedItems = cartItemRepository.deleteByCart_Id(cart.getId());
        cartRepository.deleteById(cart.getId());
        return deletedItems;
    }

    /**
     * Cap nhat license cho item trong gio hang
     */
    @Transactional
    public CartItemResponse updateCartItemLicense(String email, Integer cartItemId, UpdateCartItemLicenseRequest request) {
        User user = Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new RuntimeException("User not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: item does not belong to user");
        }

        Integer audioId = item.getAudioTrack().getId();
        Integer newLicenseId = request.getLicenseId();

        AudioTrackLicenseId newPairId = new AudioTrackLicenseId(audioId, newLicenseId);
        AudioTrackLicense newTrackLicense = audioTrackLicenseRepository.findById(newPairId)
                .orElseThrow(() -> new RuntimeException("Selected license is invalid for this audio track"));

        Optional<CartItem> duplicatedItem = cartItemRepository.findByCart_IdAndAudioTrack_IdAndLicense_Id(
                item.getCart().getId(),
                audioId,
                newLicenseId
        );
        if (duplicatedItem.isPresent() && !duplicatedItem.get().getId().equals(item.getId())) {
            throw new RuntimeException("Item with selected license already exists in cart");
        }

        item.setLicense(newTrackLicense.getLicense());
        CartItem saved = cartItemRepository.save(item);
        return toResponse(saved, newTrackLicense.getPrice(), false);
    }

    /**
     * Thanh toan don gian: tao don hang tu gio, danh dau da thanh toan, sau do xoa gio.
     */
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

    private CartItemResponse toResponse(CartItem item, Double price, boolean alreadyInCart) {
        return CartItemResponse.builder()
                .cartId(item.getCart().getId())
                .cartItemId(item.getId())
                .audioId(item.getAudioTrack().getId())
                .audioTitle(item.getAudioTrack().getTitle())
                .artistName(item.getAudioTrack().getArtist() != null ? item.getAudioTrack().getArtist().getName() : null)
                .licenseId(item.getLicense().getId())
                .licenseType(item.getLicense().getLicenseType())
                .licenseDescription(item.getLicense().getDescription())
                .price(price)
                .alreadyInCart(alreadyInCart)
                .build();
    }

    private CartItemDetailResponse toCartItemDetailResponse(CartItem item, Double price) {
        return CartItemDetailResponse.builder()
                .cartItemId(item.getId())
                .audioId(item.getAudioTrack().getId())
                .audioTitle(item.getAudioTrack().getTitle())
                .artistName(item.getAudioTrack().getArtist() != null ? item.getAudioTrack().getArtist().getName() : null)
                .coverImage(item.getAudioTrack().getCoverImage())
                .duration(item.getAudioTrack().getDuration())
                .licenseId(item.getLicense().getId())
                .licenseType(item.getLicense().getLicenseType())
                .licenseDescription(item.getLicense().getDescription())
                .price(price)
                .build();
    }
}

