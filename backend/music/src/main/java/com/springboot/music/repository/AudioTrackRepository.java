package com.springboot.music.repository;

import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AudioTrackRepository extends JpaRepository<AudioTrack, Integer>, JpaSpecificationExecutor<AudioTrack> {

    @Query("select distinct a.artist from AudioTrack a where a.artist is not null")
    List<User> findDistinctArtists();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update AudioTrack a set a.playCount = coalesce(a.playCount, 0) + 1 where a.id = :audioId")
    int incrementPlayCount(@Param("audioId") Integer audioId);

    @Query("select coalesce(a.playCount, 0) from AudioTrack a where a.id = :audioId")
    Integer findPlayCountById(@Param("audioId") Integer audioId);

}
