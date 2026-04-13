package com.springboot.music.service;

import com.springboot.music.dto.GenreDTO;
import com.springboot.music.entity.Genre;
import com.springboot.music.mapper.GenreMapper;
import com.springboot.music.repository.GenreRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenreService {

    private final GenreRepository genreRepository;
    private final GenreMapper genreMapper;

    public GenreService(GenreRepository genreRepository, GenreMapper genreMapper) {
        this.genreRepository = genreRepository;
        this.genreMapper = genreMapper;
    }

    public List<GenreDTO> getAllGenres() {
        List<Genre> genres = genreRepository.findAll();
        return genreMapper.toDtoList(genres);
    }

}
