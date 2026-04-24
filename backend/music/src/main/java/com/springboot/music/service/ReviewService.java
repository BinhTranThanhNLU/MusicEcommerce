package com.springboot.music.service;

import com.springboot.music.dto.AudioTrackReviewDTO;
import com.springboot.music.dto.ReviewSummaryDTO;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.AudioTrackReview;
import com.springboot.music.entity.User;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.AudioTrackReviewRepository;
import com.springboot.music.repository.OrderDetailRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.requestmodel.ReviewRequest;
import com.springboot.music.responsemodel.AudioTrackReviewResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    private final UserRepository userRepository;
    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackReviewRepository audioTrackReviewRepository;
    private final OrderDetailRepository orderDetailRepository;

    public ReviewService(UserRepository userRepository,
                         AudioTrackRepository audioTrackRepository,
                         AudioTrackReviewRepository audioTrackReviewRepository,
                         OrderDetailRepository orderDetailRepository) {
        this.userRepository = userRepository;
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackReviewRepository = audioTrackReviewRepository;
        this.orderDetailRepository = orderDetailRepository;
    }

    @Transactional(readOnly = true)
    public AudioTrackReviewResponse getReviewsByAudioTrack(Integer audioId, String email) {
        findAudioTrack(audioId);
        List<AudioTrackReviewDTO> reviews = audioTrackReviewRepository.findByAudioTrackIdWithUser(audioId).stream()
                .map(this::toDto)
                .toList();

        AudioTrackReviewDTO myReview = null;
        boolean canReview = false;

        if (email != null && !email.isBlank()) {
            User user = findUserByEmail(email);
            myReview = audioTrackReviewRepository.findByAudioTrack_IdAndUser_Id(audioId, user.getId())
                    .map(review -> toDto(review, true))
                    .orElse(null);
            canReview = orderDetailRepository.existsCompletedPurchaseForUserAndAudio(user.getId(), audioId);
        }

        return AudioTrackReviewResponse.builder()
                .summary(buildSummary(audioId))
                .reviews(reviews)
                .myReview(myReview)
                .canReview(canReview)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AudioTrackReviewDTO> getMyReviews(String email) {
        User user = findUserByEmail(email);
        return audioTrackReviewRepository.findByUserIdWithTrack(user.getId()).stream()
                .map(review -> toDto(review, true))
                .toList();
    }

    @Transactional
    public AudioTrackReviewDTO submitReview(String email, Integer audioId, ReviewRequest request) {
        User user = findUserByEmail(email);
        AudioTrack audioTrack = findAudioTrack(audioId);
        validatePurchased(user.getId(), audioId);
        validateRequest(request);

        AudioTrackReview review = audioTrackReviewRepository.findByAudioTrack_IdAndUser_Id(audioId, user.getId())
                .orElseGet(AudioTrackReview::new);

        review.setAudioTrack(audioTrack);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(normalizeComment(request.getComment()));

        AudioTrackReview saved = audioTrackReviewRepository.save(review);
        return toDto(saved, true);
    }

    @Transactional(readOnly = true)
    public AudioTrackReviewDTO getMyReviewForAudioTrack(String email, Integer audioId) {
        User user = findUserByEmail(email);
        return audioTrackReviewRepository.findByAudioTrack_IdAndUser_Id(audioId, user.getId())
                .map(review -> toDto(review, true))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ban chua danh gia tai nguyen nay"));
    }

    private ReviewSummaryDTO buildSummary(Integer audioId) {
        Long count = audioTrackReviewRepository.countByAudioTrack_Id(audioId);
        Double average = audioTrackReviewRepository.getAverageRatingByAudioTrackId(audioId);

        Map<Integer, Long> byStar = new HashMap<>();
        audioTrackReviewRepository.countByAudioTrackIdGroupedByRating(audioId)
                .forEach(item -> byStar.put(item.getRating(), item.getTotal()));

        return ReviewSummaryDTO.builder()
                .averageRating(average == null ? 0.0 : roundOneDecimal(average))
                .reviewCount(count)
                .fiveStarCount(byStar.getOrDefault(5, 0L))
                .fourStarCount(byStar.getOrDefault(4, 0L))
                .threeStarCount(byStar.getOrDefault(3, 0L))
                .twoStarCount(byStar.getOrDefault(2, 0L))
                .oneStarCount(byStar.getOrDefault(1, 0L))
                .build();
    }

    private AudioTrackReviewDTO toDto(AudioTrackReview review) {
        return toDto(review, false);
    }

    private AudioTrackReviewDTO toDto(AudioTrackReview review, boolean mine) {
        AudioTrack audioTrack = review.getAudioTrack();
        User user = review.getUser();
        return AudioTrackReviewDTO.builder()
                .reviewId(review.getId())
                .audioId(audioTrack != null ? audioTrack.getId() : null)
                .audioTitle(audioTrack != null ? audioTrack.getTitle() : null)
                .coverImage(audioTrack != null ? audioTrack.getCoverImage() : null)
                .userId(user != null ? user.getId() : null)
                .userName(user != null ? user.getName() : null)
                .userAvatarUrl(user != null ? user.getAvatarUrl() : null)
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .mine(mine)
                .build();
    }

    private void validatePurchased(Integer userId, Integer audioId) {
        orderDetailRepository.findCompletedPurchaseForUserAndAudio(userId, audioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Chi nguoi da mua va thanh toan thanh cong moi duoc danh gia"));
    }

    private void validateRequest(ReviewRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Du lieu danh gia khong duoc de trong");
        }
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating phai tu 1 den 5");
        }
    }

    private AudioTrack findAudioTrack(Integer audioId) {
        return audioTrackRepository.findById(audioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio track khong ton tai"));
    }

    private User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Khong tim thay nguoi dung dang nhap");
        }
        return user;
    }

    private String normalizeComment(String comment) {
        if (comment == null) {
            return null;
        }
        String normalized = comment.trim();
        return normalized.isBlank() ? null : normalized;
    }

    private double roundOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}


