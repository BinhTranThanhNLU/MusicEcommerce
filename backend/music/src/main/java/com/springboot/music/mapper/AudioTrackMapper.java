package com.springboot.music.mapper;

import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.dto.ArtistDTO;
import com.springboot.music.dto.AudioTrackLicenseDTO;
import com.springboot.music.dto.TrackTagsDTO;
import com.springboot.music.entity.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.io.IOException;
import java.util.Comparator;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AudioTrackMapper {

    // 1. từ Entity sang DTO
    @Mapping(target = "startingPrice", expression = "java(calculateStartingPrice(audioTrack.getLicenses()))")
    @Mapping(target = "tags", expression = "java(mapTags(audioTrack.getGenres(), audioTrack.getMoods()))")
    @Mapping(target = "authorName", expression = "java(mapAuthorName(audioTrack.getCopyrightInfo()))")
    @Mapping(target = "moderationDecision", expression = "java(mapModerationDecision(latestModeration(audioTrack.getModerationHistory())))")
    @Mapping(target = "rejectionReason", expression = "java(mapRejectionReason(latestModeration(audioTrack.getModerationHistory())))")
    @Mapping(target = "revisionPoints", expression = "java(mapRevisionPoints(latestModeration(audioTrack.getModerationHistory())))")
    @Mapping(target = "moderatedAt", expression = "java(mapModeratedAt(latestModeration(audioTrack.getModerationHistory())))")
    @Mapping(target = "moderatedBy", expression = "java(mapModeratedBy(latestModeration(audioTrack.getModerationHistory())))")
    AudioTrackDTO toDto(AudioTrack audioTrack);

    // 2. Từ Entity List sang DTO List
    List<AudioTrackDTO> toDtoList(List<AudioTrack> audioTracks);

    // 3. map từ User sang ArtistDTO
    ArtistDTO toArtistSummary(User user);

    // 4. map từ AudioTrackLicense sang dto
    @Mapping(source = "license.id", target = "licenseId")
    @Mapping(source = "license.licenseType", target = "licenseType")
    @Mapping(source = "license.description", target = "description")
    AudioTrackLicenseDTO toLicenseDto(AudioTrackLicense audioTrackLicense);

    // 5. Hàm custom để tính "startingPrice"
    default Double calculateStartingPrice(List<AudioTrackLicense> licenses) {
        if (licenses == null || licenses.isEmpty()) {
            return 0.0;
        }
        return licenses.stream()
                .map(AudioTrackLicense::getPrice)
                .min(Double::compareTo)
                .orElse(0.0);
    }

    // 6. Hàm custom để gom danh sách Genre và Mood thành TrackTagsDTO
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

    default String mapAuthorName(CopyrightInfo copyrightInfo) {
        return copyrightInfo != null ? copyrightInfo.getOwnerName() : null;
    }

    default AudioTrackModeration latestModeration(List<AudioTrackModeration> moderationHistory) {
        if (moderationHistory == null || moderationHistory.isEmpty()) {
            return null;
        }

        return moderationHistory.stream()
                .filter(mod -> mod != null && mod.getModeratedAt() != null)
                .max(Comparator.comparing(AudioTrackModeration::getModeratedAt))
                .orElseGet(() -> moderationHistory.stream().filter(java.util.Objects::nonNull).findFirst().orElse(null));
    }

    default String mapModerationDecision(AudioTrackModeration moderation) {
        return moderation != null ? moderation.getDecision() : null;
    }

    default String mapRejectionReason(AudioTrackModeration moderation) {
        return moderation != null ? moderation.getRejectionReason() : null;
    }

    default List<String> mapRevisionPoints(AudioTrackModeration moderation) {
        if (moderation == null || moderation.getRevisionPointsJson() == null || moderation.getRevisionPointsJson().isBlank()) {
            return Collections.emptyList();
        }

        try {
            return new ObjectMapper().readValue(moderation.getRevisionPointsJson(), new TypeReference<>() {});
        } catch (IOException ex) {
            return Collections.emptyList();
        }
    }

    default java.time.LocalDateTime mapModeratedAt(AudioTrackModeration moderation) {
        return moderation != null ? moderation.getModeratedAt() : null;
    }

    default String mapModeratedBy(AudioTrackModeration moderation) {
        return moderation != null ? moderation.getModeratedBy() : null;
    }

}