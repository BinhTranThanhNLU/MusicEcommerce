package com.springboot.music.mapper;

import com.springboot.music.dto.ThemeDTO;
import com.springboot.music.entity.Theme;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ThemeMapper {

    ThemeDTO toDto(Theme theme);

    List<ThemeDTO> toDtoList(List<Theme> themes);

}
