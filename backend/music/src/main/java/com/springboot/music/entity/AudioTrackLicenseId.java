package com.springboot.music.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AudioTrackLicenseId implements Serializable {

    @Column(name = "audio_id")
    private Integer audioId;

    @Column(name = "license_id")
    private Integer licenseId;

}
