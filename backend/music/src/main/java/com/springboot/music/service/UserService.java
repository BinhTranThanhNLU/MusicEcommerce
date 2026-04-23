package com.springboot.music.service;

import com.springboot.music.dto.AccountOrderDTO;
import com.springboot.music.dto.AccountOrderItemDTO;
import com.springboot.music.dto.LibraryItemDTO;
import com.springboot.music.dto.UserDTO;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.License;
import com.springboot.music.entity.OrderDetail;
import com.springboot.music.entity.OrderEntity;
import com.springboot.music.entity.PaymentTransaction;
import com.springboot.music.entity.User;
import com.springboot.music.mapper.UserMapper;
import com.springboot.music.repository.OrderDetailRepository;
import com.springboot.music.repository.OrderRepository;
import com.springboot.music.repository.PaymentTransactionRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.requestmodel.UpdateProfileRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private static final String DOWNLOAD_VARIANT_ORIGINAL = "ORIGINAL";
    private static final String DOWNLOAD_VARIANT_WATERMARKED = "WATERMARKED";

    private final UserRepository userRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       OrderDetailRepository orderDetailRepository,
                       OrderRepository orderRepository,
                       PaymentTransactionRepository paymentTransactionRepository,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.orderRepository = orderRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.userMapper = userMapper;
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String email) {
        User user = findUserByEmail(email);
        return userMapper.toDto(user);
    }

    @Transactional
    public UserDTO updateCurrentUser(String email, UpdateProfileRequest request) {
        User user = findUserByEmail(email);

        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Du lieu cap nhat khong duoc de trong");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }

        if (request.getAvatarUrl() != null) {
            String avatarUrl = request.getAvatarUrl().trim();
            user.setAvatarUrl(avatarUrl.isBlank() ? null : avatarUrl);
        }

        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    public List<LibraryItemDTO> getUserLibrary(Integer userId) {
        List<OrderDetail> orderDetails = orderDetailRepository.findByUserIdAndOrderCompleted(userId);
        List<LibraryItemDTO> libraryItems = new ArrayList<>();

        for (OrderDetail detail : orderDetails) {
            AudioTrack audioTrack = detail.getAudioTrack();
            User artist = audioTrack.getArtist();
            License license = detail.getLicense();

            LibraryItemDTO item = LibraryItemDTO.builder()
                    .audioId(audioTrack.getId())
                    .title(audioTrack.getTitle())
                    .audioType(audioTrack.getAudioType())
                    .artistName(artist != null ? artist.getName() : "Unknown Artist")
                    .coverImage(audioTrack.getCoverImage())
                    .licenseType(license.getLicenseType())
                    .originalFileUrl(audioTrack.getOriginalFileUrl())
                    .watermarkedFileUrl(audioTrack.getWatermarkedFileUrl())
                    .musicDownloadUrl("/users/library/" + detail.getId() + "/download")
                    .certificateDownloadUrl("/users/library/" + detail.getId() + "/certificate")
                    .certificateAvailable(true)
                    .duration(audioTrack.getDuration())
                    .purchasedAt(detail.getOrder().getCreatedAt())
                    .orderId(detail.getOrder().getId())
                    .orderDetailId(detail.getId())
                    .build();

            libraryItems.add(item);
        }

        return libraryItems;
    }

    @Transactional(readOnly = true)
    public List<AccountOrderDTO> getUserOrders(Integer userId) {
        List<OrderEntity> orders = orderRepository.findCompletedOrdersByUserId(userId);
        List<AccountOrderDTO> result = new ArrayList<>();

        for (OrderEntity order : orders) {
            PaymentTransaction transaction = paymentTransactionRepository.findByOrder_Id(order.getId()).orElse(null);
            List<AccountOrderItemDTO> items = new ArrayList<>();

            if (order.getDetails() != null) {
                for (OrderDetail detail : order.getDetails()) {
                    AudioTrack audioTrack = detail.getAudioTrack();
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
                            .musicDownloadUrl("/users/library/" + detail.getId() + "/download")
                            .certificateDownloadUrl("/users/library/" + detail.getId() + "/certificate")
                            .build());
                }
            }

            result.add(AccountOrderDTO.builder()
                    .orderId(order.getId())
                    .paymentStatus(order.getPaymentStatus())
                    .paymentMethod(transaction != null ? transaction.getPaymentMethod() : null)
                    .gatewayTransactionCode(transaction != null ? transaction.getGatewayTransactionCode() : null)
                    .totalAmount(order.getTotalAmount())
                    .createdAt(order.getCreatedAt())
                    .totalItems(items.size())
                    .items(items)
                    .build());
        }

        return result;
    }

    @Transactional(readOnly = true)
    public DownloadableMusic resolveDownload(Integer userId, Integer orderDetailId, String variant) {
        OrderDetail detail = orderDetailRepository.findDownloadItemForUser(orderDetailId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Ban khong co quyen tai tai nguyen nay hoac don hang chua thanh toan"));

        AudioTrack audioTrack = detail.getAudioTrack();
        String normalizedVariant = normalizeVariant(variant);

        String targetUrl = DOWNLOAD_VARIANT_WATERMARKED.equals(normalizedVariant)
                ? audioTrack.getWatermarkedFileUrl()
                : audioTrack.getOriginalFileUrl();

        if (targetUrl == null || targetUrl.isBlank()) {
            if (DOWNLOAD_VARIANT_WATERMARKED.equals(normalizedVariant)) {
                targetUrl = audioTrack.getOriginalFileUrl();
            } else {
                targetUrl = audioTrack.getWatermarkedFileUrl();
            }
        }

        if (targetUrl == null || targetUrl.isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Tai nguyen am thanh hien chua san sang de tai xuong");
        }

        return new DownloadableMusic(targetUrl, buildDownloadFileName(audioTrack));
    }

    private String normalizeVariant(String variant) {
        if (variant == null || variant.isBlank()) {
            return DOWNLOAD_VARIANT_ORIGINAL;
        }

        String normalized = variant.trim().toUpperCase();
        if (DOWNLOAD_VARIANT_ORIGINAL.equals(normalized) || DOWNLOAD_VARIANT_WATERMARKED.equals(normalized)) {
            return normalized;
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "variant khong hop le. Chi chap nhan ORIGINAL hoac WATERMARKED");
    }

    private String buildDownloadFileName(AudioTrack audioTrack) {
        String title = audioTrack != null ? audioTrack.getTitle() : null;
        String safeTitle = (title == null || title.isBlank()) ? "music-track" : title
                .trim()
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");

        if (safeTitle.isBlank()) {
            safeTitle = "music-track";
        }

        return safeTitle + ".mp3";
    }

    public record DownloadableMusic(String fileUrl, String fileName) {
    }

    private User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Khong tim thay nguoi dung dang nhap");
        }
        return user;
    }

}
