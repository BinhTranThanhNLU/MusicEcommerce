package com.springboot.music.responsemodel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioTrackPlayCountResponse {

    private Integer audioId;
    private Integer playCount;
}

