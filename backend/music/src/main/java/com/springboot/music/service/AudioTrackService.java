package com.springboot.music.service;

import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.entity.AudioTrackLicense;
import com.springboot.music.entity.AudioTrackLicenseId;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.CopyrightInfo;
import com.springboot.music.entity.Genre;
import com.springboot.music.entity.License;
import com.springboot.music.entity.Mood;
import com.springboot.music.entity.Theme;
import com.springboot.music.entity.User;
import com.springboot.music.mapper.AudioTrackMapper;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.AudioTrackLicenseRepository;
import com.springboot.music.repository.CopyrightInfoRepository;
import com.springboot.music.repository.GenreRepository;
import com.springboot.music.repository.LicenseRepository;
import com.springboot.music.repository.MoodRepository;
import com.springboot.music.repository.ThemeRepository;
import com.springboot.music.repository.AudioTrackReviewRepository;
import com.springboot.music.repository.UserRepository;
import com.springboot.music.requestmodel.CreateAudioTrackRequest;
import com.springboot.music.requestmodel.LicensePriceRequest;
import com.springboot.music.requestmodel.UpdateAudioTrackRequest;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import com.springboot.music.responsemodel.AudioTrackPlayCountResponse;
import com.springboot.music.specification.AudioTrackSpecification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;

@Service
public class AudioTrackService {

    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackLicenseRepository audioTrackLicenseRepository;
    private final AudioTrackMapper audioTrackMapper;
    private final AudioTrackReviewRepository audioTrackReviewRepository;
    private final CopyrightInfoRepository copyrightInfoRepository;
    private final GenreRepository genreRepository;
    private final MoodRepository moodRepository;
    private final ThemeRepository themeRepository;
    private final LicenseRepository licenseRepository;
    private final UserRepository userRepository;
    private final AudioFileStorageService audioFileStorageService;
    private final AudioMixerService audioMixerService;

    public AudioTrackService(AudioTrackRepository audioTrackRepository,
                             AudioTrackLicenseRepository audioTrackLicenseRepository,
                             AudioTrackMapper audioTrackMapper,
                             AudioTrackReviewRepository audioTrackReviewRepository,
                             CopyrightInfoRepository copyrightInfoRepository,
                             GenreRepository genreRepository,
                             MoodRepository moodRepository,
                             ThemeRepository themeRepository,
                             LicenseRepository licenseRepository,
                             UserRepository userRepository,
                             AudioFileStorageService audioFileStorageService,
                             AudioMixerService audioMixerService) {
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackLicenseRepository = audioTrackLicenseRepository;
        this.audioTrackMapper = audioTrackMapper;
        this.audioTrackReviewRepository = audioTrackReviewRepository;
        this.copyrightInfoRepository = copyrightInfoRepository;
        this.genreRepository = genreRepository;
        this.moodRepository = moodRepository;
        this.themeRepository = themeRepository;
        this.licenseRepository = licenseRepository;
        this.userRepository = userRepository;
        this.audioFileStorageService = audioFileStorageService;
        this.audioMixerService = audioMixerService;
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

    @Transactional(readOnly = true)
    public AudioTrackDTO getAudioTrackById(int id) {
        AudioTrack audioTrack = audioTrackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audio track not found with id: " + id));
        AudioTrackDTO dto = audioTrackMapper.toDto(audioTrack);
        enrichReviewStats(List.of(dto));
        return dto;
    }

    @Transactional
    public AudioTrackDTO createAudioTrack(CreateAudioTrackRequest request,
                                          MultipartFile originalFile,
                                          MultipartFile coverImageFile) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Du lieu upload khong duoc de trong");
        }

        User artist = resolveCurrentArtist();
        String title = normalizeRequiredText(request.getTitle(), "Title khong duoc de trong");
        String audioType = normalizeRequiredText(request.getAudioType(), "Audio type khong duoc de trong");
        String authorName = normalizeRequiredText(request.getAuthorName(), "Author khong duoc de trong");
        Integer duration = request.getDuration();
        if (duration == null || duration <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duration phai lon hon 0");
        }

        validateUploadFile(originalFile, true);
        validateUploadFile(coverImageFile, false);

        List<Genre> genres = loadGenres(request.getGenreIds());
        List<Mood> moods = loadMoods(request.getMoodIds());
        List<Theme> themes = loadThemes(request.getThemeIds());

        String originalFileUrl = audioFileStorageService.storeOriginalAudio(originalFile);
        String coverImageUrl = audioFileStorageService.storeCoverImage(coverImageFile);
        String previewFileUrl = createAndStorePreviewFile(originalFile);

        AudioTrack audioTrack = AudioTrack.builder()
                .title(title)
                .audioType(audioType)
                .description(normalizeOptionalText(request.getDescription()))
                .lyrics(normalizeOptionalText(request.getLyrics()))
                .duration(duration)
                .originalFileUrl(originalFileUrl)
                .watermarkedFileUrl(previewFileUrl)
                .coverImage(coverImageUrl)
                .status("Pending")
                .playCount(0)
                .esSyncStatus("Pending")
                .uploadDate(LocalDateTime.now())
                .artist(artist)
                .genres(genres)
                .moods(moods)
                .themes(themes)
                .build();

        AudioTrack savedTrack = audioTrackRepository.save(audioTrack);

        CopyrightInfo copyrightInfo = copyrightInfoRepository.findByAudioTrack_Id(savedTrack.getId())
                .orElseGet(() -> CopyrightInfo.builder().audioTrack(savedTrack).build());
        copyrightInfo.setOwnerName(authorName);
        copyrightInfoRepository.save(copyrightInfo);
        savedTrack.setCopyrightInfo(copyrightInfo);

        List<AudioTrackLicense> trackLicenses = buildAndSaveLicenses(savedTrack, request.getLicensePrices());
        savedTrack.setLicenses(trackLicenses);

        AudioTrackDTO dto = audioTrackMapper.toDto(savedTrack);
        enrichReviewStats(List.of(dto));
        return dto;
    }

    private User resolveCurrentArtist() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Can dang nhap de upload bai hat");
        }

        User user = Optional.ofNullable(userRepository.findByEmail(authentication.getName()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nguoi dung khong ton tai"));

        String roleName = user.getRole() != null ? user.getRole().getName() : null;
        if (roleName == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tai khoan khong co quyen upload bai hat");
        }

        String normalizedRole = roleName.toUpperCase(Locale.ROOT);
        if (!normalizedRole.contains("ARTIST") && !normalizedRole.contains("ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chi artist hoac admin moi duoc upload bai hat");
        }

        return user;
    }

    private String normalizeRequiredText(String value, String errorMessage) {
        if (value == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage);
        }

        String normalized = value.trim();
        if (normalized.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage);
        }

        return normalized;
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isBlank() ? null : normalized;
    }

    private void validateUploadFile(MultipartFile file, boolean audioFile) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    audioFile ? "Audio file khong duoc de trong" : "Cover image khong duoc de trong");
        }
    }

    private List<Genre> loadGenres(List<Integer> genreIds) {
        if (genreIds == null || genreIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can it nhat 1 genre");
        }

        List<Genre> genres = new ArrayList<>();
        for (Integer genreId : new LinkedHashSet<>(genreIds)) {
            Genre genre = genreRepository.findById(genreId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Genre khong ton tai: " + genreId));
            genres.add(genre);
        }
        return genres;
    }

    private List<Mood> loadMoods(List<Integer> moodIds) {
        if (moodIds == null || moodIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can it nhat 1 mood");
        }

        List<Mood> moods = new ArrayList<>();
        for (Integer moodId : new LinkedHashSet<>(moodIds)) {
            Mood mood = moodRepository.findById(moodId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mood khong ton tai: " + moodId));
            moods.add(mood);
        }
        return moods;
    }

    private List<Theme> loadThemes(List<Integer> themeIds) {
        if (themeIds == null || themeIds.isEmpty()) {
            return List.of();
        }

        List<Theme> themes = new ArrayList<>();
        for (Integer themeId : new LinkedHashSet<>(themeIds)) {
            Theme theme = themeRepository.findById(themeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Theme khong ton tai: " + themeId));
            themes.add(theme);
        }
        return themes;
    }

    private List<AudioTrackLicense> buildAndSaveLicenses(AudioTrack savedTrack, List<LicensePriceRequest> licensePrices) {
        if (licensePrices == null || licensePrices.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can it nhat 1 license price");
        }

        Set<Integer> seenLicenseIds = new HashSet<>();
        List<AudioTrackLicense> trackLicenses = new ArrayList<>();

        for (LicensePriceRequest licensePrice : licensePrices) {
            if (licensePrice == null || licensePrice.getLicenseId() == null || licensePrice.getPrice() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thong tin license price khong hop le");
            }

            if (!seenLicenseIds.add(licensePrice.getLicenseId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "License id bi trung: " + licensePrice.getLicenseId());
            }

            License license = licenseRepository.findById(licensePrice.getLicenseId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "License khong ton tai: " + licensePrice.getLicenseId()));

            AudioTrackLicense trackLicense = AudioTrackLicense.builder()
                    .id(new AudioTrackLicenseId(savedTrack.getId(), license.getId()))
                    .audioTrack(savedTrack)
                    .license(license)
                    .price(licensePrice.getPrice())
                    .build();
            trackLicenses.add(trackLicense);
        }

        audioTrackLicenseRepository.saveAll(trackLicenses);
        return trackLicenses;
    }

    private String createAndStorePreviewFile(MultipartFile originalFile) {
        Path previewFilePath = audioMixerService.createWatermarkedPreview(originalFile);
        try {
            return audioFileStorageService.storeWatermarkedPreview(previewFilePath);
        } finally {
            cleanupTempFile(previewFilePath);
        }
    }

    private void cleanupTempFile(Path filePath) {
        if (filePath == null) {
            return;
        }

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
            // Keep cleanup failure non-fatal to avoid hiding main business flow errors.
        }
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

        if (request.getAuthorName() != null) {
            hasAnyField = true;
            String authorName = request.getAuthorName().trim();
            if (authorName.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author khong duoc de trong");
            }

            CopyrightInfo copyrightInfo = copyrightInfoRepository.findByAudioTrack_Id(audioId)
                    .orElseGet(() -> CopyrightInfo.builder().audioTrack(audioTrack).build());
            copyrightInfo.setOwnerName(authorName);
            copyrightInfoRepository.save(copyrightInfo);
            audioTrack.setCopyrightInfo(copyrightInfo);
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
