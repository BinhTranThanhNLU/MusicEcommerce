package com.springboot.music.service;

import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.AudioTrackReviewRepository;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import com.springboot.music.specification.AudioTrackSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AudioTrackService {

    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackMapper audioTrackMapper;
    private final AudioTrackReviewRepository audioTrackReviewRepository;

    public AudioTrackService(AudioTrackRepository audioTrackRepository,
                             AudioTrackMapper audioTrackMapper,
                             AudioTrackReviewRepository audioTrackReviewRepository) {
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackMapper = audioTrackMapper;
        this.audioTrackReviewRepository = audioTrackReviewRepository;
    }

    @Transactional(readOnly = true)
    public List<AudioTrackDTO> getAllAudioTracks() {
        List<AudioTrack> tracks = audioTrackRepository.findAll();
        List<AudioTrackDTO> dtos = audioTrackMapper.toDtoList(tracks);
        enrichReviewStats(dtos);
        return dtos;
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
        enrichReviewStats(audioTracks);
        return new AudioTrackPageResponse(
                audioTracks,
                audioTrackPage.getNumber(),
                audioTrackPage.getTotalPages(),
                audioTrackPage.getTotalElements()
        );
    }

    public AudioTrackDTO getAudioTrackById(int id) {
        AudioTrack audioTrack = audioTrackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audio track not found with id: " + id));
        AudioTrackDTO dto = audioTrackMapper.toDto(audioTrack);
        enrichReviewStats(List.of(dto));
        return dto;
    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getAudioTracksByArtistId(int artistId, int page, int size, Double minPrice, Double maxPrice, List<String> types, String sort) {
        Pageable pageable = PageRequest.of(page, size);

        // Truyền List.of(artistId) vào vị trí của artistIds trong Specification
        Specification<AudioTrack> spec = AudioTrackSpecification.filter(null, null, null, minPrice, maxPrice, types, List.of(artistId), sort);
        Page<AudioTrack> audioTrackPage = audioTrackRepository.findAll(spec, pageable);

        return createPageResponse(audioTrackPage);
    }

    private void enrichReviewStats(List<AudioTrackDTO> audioTracks) {
        for (AudioTrackDTO dto : audioTracks) {
            if (dto == null || dto.getId() == null) {
                continue;
            }

            Double averageRating = audioTrackReviewRepository.getAverageRatingByAudioTrackId(dto.getId());
            long reviewCount = audioTrackReviewRepository.countByAudioTrack_Id(dto.getId());

            dto.setAverageRating(averageRating == null ? 0.0 : roundOneDecimal(averageRating));
            dto.setReviewCount(reviewCount);
        }
    }

    private double roundOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

}
