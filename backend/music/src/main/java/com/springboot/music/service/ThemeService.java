package com.springboot.music.service;

import com.springboot.music.dto.ThemeDTO;
import com.springboot.music.entity.Theme;
import com.springboot.music.mapper.ThemeMapper;
import com.springboot.music.repository.ThemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThemeService {

    private final ThemeRepository themeRepository;
    private final ThemeMapper themeMapper;

    public ThemeService(ThemeRepository themeRepository, ThemeMapper themeMapper) {
        this.themeRepository = themeRepository;
        this.themeMapper = themeMapper;
    }

    public List<ThemeDTO> getAllThemes() {
        List<Theme> themes = themeRepository.findAll();
        return themeMapper.toDtoList(themes);
    }

}
