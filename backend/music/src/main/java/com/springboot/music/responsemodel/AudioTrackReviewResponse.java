package com.springboot.music.responsemodel;

import com.springboot.music.dto.AudioTrackReviewDTO;
import com.springboot.music.dto.ReviewSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioTrackReviewResponse {

    private ReviewSummaryDTO summary;
    private List<AudioTrackReviewDTO> reviews;
    private AudioTrackReviewDTO myReview;
    private Boolean canReview;
}


