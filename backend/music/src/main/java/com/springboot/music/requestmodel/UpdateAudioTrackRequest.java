package com.springboot.music.requestmodel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAudioTrackRequest {

    private String title;
    private String audioType;
    private String description;
    private String lyrics;
    private String authorName;
    private Integer duration;
    private String originalFileUrl;
    private String watermarkedFileUrl;
    private String coverImage;
    private String status;

}

