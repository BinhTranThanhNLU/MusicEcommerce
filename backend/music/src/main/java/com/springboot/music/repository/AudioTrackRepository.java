package com.springboot.music.repository;

import com.springboot.music.entity.AudioTrack;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioTrackRepository extends JpaRepository<AudioTrack, Integer> {

    Page<AudioTrack> findByGenres_Id(int genreId, Pageable pageable);

    Page<AudioTrack> findByMoods_Id(int moodId, Pageable pageable);

    Page<AudioTrack> findByThemes_Id(int themeId, Pageable pageable);

}
