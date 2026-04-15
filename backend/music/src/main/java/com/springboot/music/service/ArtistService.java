package com.springboot.music.service;

import com.springboot.music.dto.ArtistDTO;
import com.springboot.music.entity.User;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.repository.AudioTrackRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class ArtistService {

    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackMapper audioTrackMapper;

    public ArtistService(AudioTrackRepository audioTrackRepository, AudioTrackMapper audioTrackMapper) {
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackMapper = audioTrackMapper;
    }

    public List<ArtistDTO> getAllArtists() {
        List<User> artists = audioTrackRepository.findDistinctArtists();

        return artists.stream()
                .map(audioTrackMapper::toArtistSummary)
                .sorted(Comparator.comparing(ArtistDTO::getName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }
}