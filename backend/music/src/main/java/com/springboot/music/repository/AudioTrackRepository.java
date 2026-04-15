package com.springboot.music.repository;

import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AudioTrackRepository extends JpaRepository<AudioTrack, Integer>, JpaSpecificationExecutor<AudioTrack> {

    @Query("select distinct a.artist from AudioTrack a where a.artist is not null")
    List<User> findDistinctArtists();

}
