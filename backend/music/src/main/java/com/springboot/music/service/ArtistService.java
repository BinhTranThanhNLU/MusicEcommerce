package com.springboot.music.service;

import com.springboot.music.dto.ArtistDTO;
import com.springboot.music.dto.ArtistLicenseDTO;
import com.springboot.music.dto.ArtistLicenseStatsDTO;
import com.springboot.music.entity.OrderDetail;
import com.springboot.music.entity.User;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.OrderDetailRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.responsemodel.ArtistLicensePageResponse;
import com.springboot.music.specification.OrderDetailSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistService {

    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackMapper audioTrackMapper;
    private final UserRepository userRepository;
    private final OrderDetailRepository orderDetailRepository;

    public ArtistService(AudioTrackRepository audioTrackRepository, AudioTrackMapper audioTrackMapper, UserRepository userRepository, OrderDetailRepository orderDetailRepository) {
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackMapper = audioTrackMapper;
        this.userRepository = userRepository;
        this.orderDetailRepository = orderDetailRepository;
    }

    public List<ArtistDTO> getAllArtists() {
        List<User> artists = audioTrackRepository.findDistinctArtists();

        return artists.stream()
                .map(audioTrackMapper::toArtistSummary)
                .sorted(Comparator.comparing(ArtistDTO::getName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    @Transactional(readOnly = true)
    public ArtistLicensePageResponse getArtistLicenses(String email, int page, int size, String search, String licenseType, String status) {
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin nghệ sĩ");
        }

        Pageable pageable = PageRequest.of(page, size);

        Page<OrderDetail> orderDetailPage = orderDetailRepository.findAll(
                OrderDetailSpecification.filterForArtist(artist.getId(), search, licenseType, status),
                pageable
        );

        List<ArtistLicenseDTO> licenseDTOs = orderDetailPage.getContent().stream().map(detail -> {
            return ArtistLicenseDTO.builder()
                    .orderDetailId(detail.getId())
                    .watermarkId(detail.getWatermarkId() != null ? detail.getWatermarkId() : "Không áp dụng")
                    .customerName(detail.getOrder().getUser().getName())
                    .customerEmail(detail.getOrder().getUser().getEmail())
                    .audioId(detail.getAudioTrack().getId())
                    .trackName(detail.getAudioTrack().getTitle())
                    .coverImage(detail.getAudioTrack().getCoverImage())
                    .licenseType(detail.getLicense().getLicenseType())
                    .price(detail.getPrice())
                    .licenseStatus(detail.getLicenseStatus())
                    .issuedAt(detail.getOrder().getCreatedAt())
                    .expiredAt(detail.getExpiredAt())
                    .build();
        }).collect(Collectors.toList());

        return new ArtistLicensePageResponse(
                licenseDTOs,
                orderDetailPage.getNumber(),
                orderDetailPage.getTotalPages(),
                orderDetailPage.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public ArtistLicenseStatsDTO getArtistLicenseStats(String email) {
        User artist = userRepository.findByEmail(email);
        if (artist == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin nghệ sĩ");
        }

        long total = orderDetailRepository.countTotalLicensesByArtistId(artist.getId());
        long commercial = orderDetailRepository.countCommercialLicensesByArtistId(artist.getId());

        return ArtistLicenseStatsDTO.builder()
                .totalLicenses(total)
                .commercialAndExclusiveLicenses(commercial)
                .copyrightWarnings(0) // Tạm thời để 0, sau này làm module Report sẽ thay thế bằng Query thật
                .build();
    }
}