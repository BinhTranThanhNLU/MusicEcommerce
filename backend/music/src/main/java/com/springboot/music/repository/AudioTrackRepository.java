package com.springboot.music.repository;

import com.springboot.music.entity.AudioTrack;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AudioTrackRepository extends JpaRepository<AudioTrack, Integer>, JpaSpecificationExecutor<AudioTrack> {

}
