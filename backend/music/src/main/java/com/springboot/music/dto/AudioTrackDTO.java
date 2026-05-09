package com.springboot.music.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioTrackDTO {

    private Integer id;
    private String title;
    private String audioType;
    private Integer duration;
    private String coverImage;
    private String watermarkedFileUrl;
    private Integer playCount;
    private Double startingPrice;
    private Double averageRating;
    private Long reviewCount;
    private LocalDateTime uploadDate;
    private String status;
    private String authorName;
    private String moderationDecision;
    private String rejectionReason;
    private List<String> revisionPoints;
    private LocalDateTime moderatedAt;
    private String moderatedBy;

    private ArtistDTO artist;
    private TrackTagsDTO tags;

    private List<AudioTrackLicenseDTO> licenses;

    private String description;
    private String lyrics;

}
