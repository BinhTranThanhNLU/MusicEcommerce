package com.springboot.music.controller;

import com.springboot.music.dto.AudioTrackReviewDTO;
import com.springboot.music.requestmodel.ReviewRequest;
import com.springboot.music.responsemodel.AudioTrackReviewResponse;
import com.springboot.music.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/audio-tracks/{audioId}")
    public ResponseEntity<AudioTrackReviewResponse> getReviewsByAudioTrack(@PathVariable Integer audioId) {
        return ResponseEntity.ok(reviewService.getReviewsByAudioTrack(audioId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<AudioTrackReviewDTO>> getMyReviews(Authentication authentication) {
        return ResponseEntity.ok(reviewService.getMyReviews(authentication.getName()));
    }

    @GetMapping("/audio-tracks/{audioId}/me")
    public ResponseEntity<AudioTrackReviewDTO> getMyReviewForAudioTrack(@PathVariable Integer audioId,
                                                                        Authentication authentication) {
        return ResponseEntity.ok(reviewService.getMyReviewForAudioTrack(authentication.getName(), audioId));
    }

    @PostMapping("/audio-tracks/{audioId}")
    public ResponseEntity<AudioTrackReviewDTO> submitReview(@PathVariable Integer audioId,
                                                            @Valid @RequestBody ReviewRequest request,
                                                            Authentication authentication) {
        AudioTrackReviewDTO saved = reviewService.submitReview(authentication.getName(), audioId, request);
        return ResponseEntity.status(HttpStatus.OK).body(saved);
    }
}

