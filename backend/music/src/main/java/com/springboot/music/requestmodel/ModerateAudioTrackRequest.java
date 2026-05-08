package com.springboot.music.requestmodel;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ModerateAudioTrackRequest {

    private String reason;
    private List<String> revisionPoints;
}
