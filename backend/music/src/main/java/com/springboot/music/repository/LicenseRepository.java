package com.springboot.music.repository;

import com.springboot.music.entity.License;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LicenseRepository extends JpaRepository<License, Integer> {
}

