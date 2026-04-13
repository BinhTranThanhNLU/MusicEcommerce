package com.springboot.music.service;

import com.springboot.music.dto.MoodDTO;
import com.springboot.music.entity.Mood;
import com.springboot.music.mapper.MoodMapper;
import com.springboot.music.repository.MoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MoodService {

    private final MoodRepository moodRepository;
    private final MoodMapper moodMapper;

    public MoodService(MoodRepository moodRepository, MoodMapper moodMapper) {
        this.moodRepository = moodRepository;
        this.moodMapper = moodMapper;
    }

    public List<MoodDTO> getAllMoods() {
        List<Mood> moods = moodRepository.findAll();
        return moodMapper.toDtoList(moods);
    }

}
