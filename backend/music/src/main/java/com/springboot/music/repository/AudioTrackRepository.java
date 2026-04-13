package com.springboot.music.repository;

import com.springboot.music.entity.AudioTrack;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioTrackRepository extends JpaRepository<AudioTrack, Integer> {
}
