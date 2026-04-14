package com.springboot.music.responsemodel;

import com.springboot.music.dto.AudioTrackDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioTrackPageResponse {

    private List<AudioTrackDTO> tracks;
    private int currentPage;
    private int totalPages;
    private long totalItems;

}
