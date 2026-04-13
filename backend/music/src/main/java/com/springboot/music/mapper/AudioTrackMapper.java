package com.springboot.music.mapper;

import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.dto.ArtistDTO;
import com.springboot.music.dto.TrackTagsDTO;
import com.springboot.music.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AudioTrackMapper {

    // 1. từ Entity sang DTO
    @Mapping(target = "startingPrice", expression = "java(calculateStartingPrice(audioTrack.getLicenses()))")
    @Mapping(target = "tags", expression = "java(mapTags(audioTrack.getGenres(), audioTrack.getMoods()))")
    AudioTrackDTO toDto(AudioTrack audioTrack);

    // 5. Từ Entity List sang DTO List
    List<AudioTrackDTO> toDtoList(List<AudioTrack> audioTracks);

    // 2. map từ User sang ArtistDTO
    ArtistDTO toArtistSummary(User user);

    // 3. Hàm custom để tính "startingPrice"
    default Double calculateStartingPrice(List<AudioTrackLicense> licenses) {
        if (licenses == null || licenses.isEmpty()) {
            return 0.0;
        }
        return licenses.stream()
                .map(AudioTrackLicense::getPrice)
                .min(Double::compareTo)
                .orElse(0.0);
    }

    // 4. Hàm custom để gom danh sách Genre và Mood thành TrackTagsDTO
    default TrackTagsDTO mapTags(List<Genre> genres, List<Mood> moods) {
        List<String> genreNames = genres != null ?
                genres.stream().map(Genre::getName).collect(Collectors.toList()) :
                Collections.emptyList();

        List<String> moodNames = moods != null ?
                moods.stream().map(Mood::getName).collect(Collectors.toList()) :
                Collections.emptyList();

        return TrackTagsDTO.builder()
                .genres(genreNames)
                .moods(moodNames)
                .build();
    }

}