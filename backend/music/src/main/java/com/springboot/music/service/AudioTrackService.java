package com.springboot.music.service;

import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.AudioTrackReviewRepository;
import com.springboot.music.requestmodel.UpdateAudioTrackRequest;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import com.springboot.music.responsemodel.AudioTrackPlayCountResponse;
import com.springboot.music.specification.AudioTrackSpecification;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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

    @Transactional
    public AudioTrackPlayCountResponse incrementPreviewPlayCount(Integer audioId) {
        if (audioId == null || audioId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio id khong hop le");
        }

        int updatedRows = audioTrackRepository.incrementPlayCount(audioId);
        if (updatedRows == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio track khong ton tai");
        }

        Integer playCount = audioTrackRepository.findPlayCountById(audioId);
        return AudioTrackPlayCountResponse.builder()
                .audioId(audioId)
                .playCount(playCount == null ? 0 : playCount)
                .build();
    }

    @Transactional
    public AudioTrackDTO updateAudioTrack(Integer audioId, UpdateAudioTrackRequest request) {
        if (audioId == null || audioId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio id khong hop le");
        }
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Du lieu cap nhat khong duoc de trong");
        }

        AudioTrack audioTrack = audioTrackRepository.findById(audioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio track khong ton tai"));

        boolean hasAnyField = false;

        if (request.getTitle() != null) {
            hasAnyField = true;
            String title = request.getTitle().trim();
            if (title.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title khong duoc de trong");
            }
            audioTrack.setTitle(title);
        }

        if (request.getAudioType() != null) {
            hasAnyField = true;
            String audioType = request.getAudioType().trim();
            if (audioType.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio type khong duoc de trong");
            }
            audioTrack.setAudioType(audioType);
        }

        if (request.getDescription() != null) {
            hasAnyField = true;
            String description = request.getDescription().trim();
            audioTrack.setDescription(description.isBlank() ? null : description);
        }

        if (request.getLyrics() != null) {
            hasAnyField = true;
            String lyrics = request.getLyrics().trim();
            audioTrack.setLyrics(lyrics.isBlank() ? null : lyrics);
        }

        if (request.getDuration() != null) {
            hasAnyField = true;
            if (request.getDuration() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duration phai lon hon 0");
            }
            audioTrack.setDuration(request.getDuration());
        }

        if (request.getOriginalFileUrl() != null) {
            hasAnyField = true;
            String originalFileUrl = request.getOriginalFileUrl().trim();
            audioTrack.setOriginalFileUrl(originalFileUrl.isBlank() ? null : originalFileUrl);
        }

        if (request.getWatermarkedFileUrl() != null) {
            hasAnyField = true;
            String watermarkedFileUrl = request.getWatermarkedFileUrl().trim();
            audioTrack.setWatermarkedFileUrl(watermarkedFileUrl.isBlank() ? null : watermarkedFileUrl);
        }

        if (request.getCoverImage() != null) {
            hasAnyField = true;
            String coverImage = request.getCoverImage().trim();
            audioTrack.setCoverImage(coverImage.isBlank() ? null : coverImage);
        }

        if (request.getStatus() != null) {
            hasAnyField = true;
            String status = request.getStatus().trim();
            audioTrack.setStatus(status.isBlank() ? null : status);
        }

        if (!hasAnyField) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can it nhat 1 truong de cap nhat");
        }

        AudioTrack savedTrack = audioTrackRepository.save(audioTrack);
        AudioTrackDTO dto = audioTrackMapper.toDto(savedTrack);
        enrichReviewStats(List.of(dto));
        return dto;
    }

    @Transactional
    public void deleteAudioTrack(Integer audioId) {
        if (audioId == null || audioId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio id khong hop le");
        }

        AudioTrack audioTrack = audioTrackRepository.findById(audioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio track khong ton tai"));

        try {
            audioTrackRepository.delete(audioTrack);
            audioTrackRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Khong the xoa audio track vi du lieu dang duoc su dung", ex);
        }
    }

}
