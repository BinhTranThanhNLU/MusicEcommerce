package com.springboot.music.mapper;

import com.springboot.music.dto.MoodDTO;
import com.springboot.music.entity.Mood;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MoodMapper {

    MoodDTO toDto(Mood mood);

    List<MoodDTO> toDtoList(List<Mood> moods);

}
