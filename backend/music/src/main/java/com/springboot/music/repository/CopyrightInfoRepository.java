package com.springboot.music.repository;

import com.springboot.music.entity.CopyrightInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CopyrightInfoRepository extends JpaRepository<CopyrightInfo, Integer> {

    Optional<CopyrightInfo> findByAudioTrack_Id(Integer audioId);
}

