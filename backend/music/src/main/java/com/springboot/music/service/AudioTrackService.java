package com.springboot.music.service;

import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import com.springboot.music.specification.AudioTrackSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
    public AudioTrackPageResponse getAudioTracksByGenreId(int idGenre, int page, int size, Double minPrice, Double maxPrice, List<String> types, List<Integer> artistIds, String sort) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<AudioTrack> spec = AudioTrackSpecification.filter(idGenre, null, null, minPrice, maxPrice, types, artistIds, sort);
        Page<AudioTrack> audioTrackPage = audioTrackRepository.findAll(spec, pageable);

        return createPageResponse(audioTrackPage);
    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getAudioTracksByMoodId(int idMood, int page, int size, Double minPrice, Double maxPrice, List<String> types, List<Integer> artistIds, String sort) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<AudioTrack> spec = AudioTrackSpecification.filter(null, idMood, null, minPrice, maxPrice, types, artistIds, sort);
        Page<AudioTrack> audioTrackPage = audioTrackRepository.findAll(spec, pageable);

        return createPageResponse(audioTrackPage);
    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getAudioTracksByThemeId(int idTheme, int page, int size, Double minPrice, Double maxPrice, List<String> types, List<Integer> artistIds, String sort) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<AudioTrack> spec = AudioTrackSpecification.filter(null, null, idTheme, minPrice, maxPrice, types, artistIds, sort);
        Page<AudioTrack> audioTrackPage = audioTrackRepository.findAll(spec, pageable);

        return createPageResponse(audioTrackPage);
    }

    private AudioTrackPageResponse createPageResponse(Page<AudioTrack> audioTrackPage) {
        List<AudioTrackDTO> audioTracks = audioTrackMapper.toDtoList(audioTrackPage.getContent());
        return new AudioTrackPageResponse(
                audioTracks,
                audioTrackPage.getNumber(),
                audioTrackPage.getTotalPages(),
                audioTrackPage.getTotalElements()
        );
    }

}
