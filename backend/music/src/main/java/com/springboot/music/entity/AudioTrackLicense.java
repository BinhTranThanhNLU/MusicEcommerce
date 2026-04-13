package com.springboot.music.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Audio_Track_License")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioTrackLicense {

    @EmbeddedId
    private AudioTrackLicenseId id;

    @ManyToOne
    @MapsId("audioId")
    @JoinColumn(name = "audio_id")
    private AudioTrack audioTrack;

    @ManyToOne
    @MapsId("licenseId")
    @JoinColumn(name = "license_id")
    private License license;

    @Column(name = "price")
    private Double price;
}
