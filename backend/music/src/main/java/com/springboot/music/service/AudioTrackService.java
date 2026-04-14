package com.springboot.music.service;

import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AudioTrackService {

    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackMapper audioTrackMapper;

    public AudioTrackService(AudioTrackRepository audioTrackRepository, AudioTrackMapper audioTrackMapper) {
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackMapper = audioTrackMapper;
    }

    @Transactional(readOnly = true)
    public List<AudioTrackDTO> getAllAudioTracks() {
        List<AudioTrack> tracks = audioTrackRepository.findAll();
        return audioTrackMapper.toDtoList(tracks);
    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getAudioTracksByGenreId(int idGenre, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uploadDate").descending());

        Page<AudioTrack> audioTrackPage = audioTrackRepository.findByGenres_Id(idGenre, pageable);

        List<AudioTrackDTO> audioTracks = audioTrackMapper.toDtoList(audioTrackPage.getContent());

        return new AudioTrackPageResponse(
                audioTracks,
                audioTrackPage.getNumber(),
                audioTrackPage.getTotalPages(),
                audioTrackPage.getTotalElements()
        );

    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getAudioTracksByMoodId(int idMood, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uploadDate").descending());

        Page<AudioTrack> audioTrackPage = audioTrackRepository.findByMoods_Id(idMood, pageable);

        List<AudioTrackDTO> audioTracks = audioTrackMapper.toDtoList(audioTrackPage.getContent());

        return new AudioTrackPageResponse(
                audioTracks,
                audioTrackPage.getNumber(),
                audioTrackPage.getTotalPages(),
                audioTrackPage.getTotalElements()
        );

    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getAudioTracksByThemeId(int idTheme, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uploadDate").descending());

        Page<AudioTrack> audioTrackPage = audioTrackRepository.findByThemes_Id(idTheme, pageable);

        List<AudioTrackDTO> audioTracks = audioTrackMapper.toDtoList(audioTrackPage.getContent());

        return new AudioTrackPageResponse(
                audioTracks,
                audioTrackPage.getNumber(),
                audioTrackPage.getTotalPages(),
                audioTrackPage.getTotalElements()
        );

    }

}
