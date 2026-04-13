package com.springboot.music.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
public class TrackTagsDTO {

    private List<String> genres;
    private List<String> moods;

}
