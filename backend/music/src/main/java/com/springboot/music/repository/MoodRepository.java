package com.springboot.music.repository;

import com.springboot.music.entity.Mood;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoodRepository extends JpaRepository<Mood, Integer> {
}
