package com.springboot.music.repository;

import com.springboot.music.entity.AudioTrackLicense;
import com.springboot.music.entity.AudioTrackLicenseId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioTrackLicenseRepository extends JpaRepository<AudioTrackLicense, AudioTrackLicenseId> {
}

