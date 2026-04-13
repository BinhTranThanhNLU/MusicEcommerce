package com.springboot.music.dto;

import lombok.*;

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

    private ArtistDTO artist;
    private TrackTagsDTO tags;

}
