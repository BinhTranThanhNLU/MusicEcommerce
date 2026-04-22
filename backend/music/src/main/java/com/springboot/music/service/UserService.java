package com.springboot.music.service;

import com.springboot.music.dto.LibraryItemDTO;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.License;
import com.springboot.music.entity.OrderDetail;
import com.springboot.music.entity.User;
import com.springboot.music.repository.OrderDetailRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final OrderDetailRepository orderDetailRepository;

    public UserService(OrderDetailRepository orderDetailRepository) {
        this.orderDetailRepository = orderDetailRepository;
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
                    .duration(audioTrack.getDuration())
                    .purchasedAt(detail.getOrder().getCreatedAt())
                    .orderId(detail.getOrder().getId())
                    .orderDetailId(detail.getId())
                    .build();

            libraryItems.add(item);
        }

        return libraryItems;
    }

}
