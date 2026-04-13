package com.springboot.music.mapper;

import com.springboot.music.dto.GenreDTO;
import com.springboot.music.entity.Genre;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GenreMapper {

    GenreDTO toDto(Genre genre);

    List<GenreDTO> toDtoList(List<Genre> genres);

}
