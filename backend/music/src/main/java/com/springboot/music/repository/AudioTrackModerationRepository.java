package com.springboot.music.repository;

import com.springboot.music.entity.AudioTrackModeration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AudioTrackModerationRepository extends JpaRepository<AudioTrackModeration, Integer> {

    Optional<AudioTrackModeration> findFirstByAudioTrack_IdOrderByModeratedAtDesc(Integer audioId);

    java.util.List<AudioTrackModeration> findByAudioTrack_IdOrderByModeratedAtDesc(Integer audioId);
}
