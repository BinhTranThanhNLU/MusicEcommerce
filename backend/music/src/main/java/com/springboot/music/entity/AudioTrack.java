package com.springboot.music.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Audio_Track")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audio_id")
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "audio_type")
    private String audioType;

    @Column(name = "description")
    private String description;

    @Column(name = "lyrics", columnDefinition = "TEXT")
    private String lyrics;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "original_file_url")
    private String originalFileUrl;

    @Column(name = "watermarked_file_url")
    private String watermarkedFileUrl;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "status")
    private String status;

    @Column(name = "play_count")
    private Integer playCount;

    @Column(name = "es_sync_status")
    private String esSyncStatus;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private User artist;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "Audio_Track_Genre",
            joinColumns = @JoinColumn(name = "audio_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<Genre> genres;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "Audio_Track_Mood",
            joinColumns = @JoinColumn(name = "audio_id"),
            inverseJoinColumns = @JoinColumn(name = "mood_id")
    )
    private List<Mood> moods;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "Audio_Track_Theme",
            joinColumns = @JoinColumn(name = "audio_id"),
            inverseJoinColumns = @JoinColumn(name = "theme_id")
    )
    private List<Theme> themes;

    @OneToMany(mappedBy = "audioTrack", fetch = FetchType.LAZY)
    private List<AudioTrackLicense> licenses;

    @OneToOne(mappedBy = "audioTrack", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CopyrightInfo copyrightInfo;
}