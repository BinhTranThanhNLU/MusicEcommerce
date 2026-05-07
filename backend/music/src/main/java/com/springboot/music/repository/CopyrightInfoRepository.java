package com.springboot.music.repository;

import com.springboot.music.entity.CopyrightInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CopyrightInfoRepository extends JpaRepository<CopyrightInfo, Integer> {

    Optional<CopyrightInfo> findByAudioTrack_Id(Integer audioId);

    Page<CopyrightInfo> findByOwnerNameContainingIgnoreCase(String ownerName, Pageable pageable);

    Page<CopyrightInfo> findByAudioTrack_Id(Integer audioId, Pageable pageable);

    Page<CopyrightInfo> findByAudioTrack_IdAndOwnerNameContainingIgnoreCase(Integer audioId, String ownerName, Pageable pageable);
}

