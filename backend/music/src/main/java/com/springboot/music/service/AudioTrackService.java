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
import com.springboot.music.repository.*;
import com.springboot.music.requestmodel.CreateAudioTrackRequest;
import com.springboot.music.requestmodel.LicensePriceRequest;
import com.springboot.music.requestmodel.UpdateAudioTrackRequest;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import com.springboot.music.responsemodel.AudioTrackPlayCountResponse;
import com.springboot.music.specification.AudioTrackSpecification;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final AudioTrackIndexingService audioTrackIndexingService;

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
                              AudioMixerService audioMixerService,
                              AudioTrackIndexingService audioTrackIndexingService) {
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
        this.audioTrackIndexingService = audioTrackIndexingService;
    }

    // ------------------------------ Method cho chức năng upload-----------------------------

    // Tạo mới một audio track
    @Transactional
    public AudioTrackDTO createAudioTrack(CreateAudioTrackRequest request,
                                          MultipartFile originalFile,
                                          MultipartFile coverImageFile) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu upload không được để trống");
        }

        User artist = resolveCurrentArtist();
        String title = normalizeRequiredText(request.getTitle(), "Tên không được để trống");
        String audioType = normalizeRequiredText(request.getAudioType(), "Thể loại không được để trống");
        String authorName = normalizeRequiredText(request.getAuthorName(), "Tác giả không được để trống");
        Integer duration = request.getDuration();
        if (duration == null || duration <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời lượng phải lớn hơn 0");
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

        try {
            // Đồng bộ dữ liệu sang Elasticsearch
            syncToElasticsearch(savedTrack, trackLicenses);

            // Nếu ES lưu thành công, cập nhật trạng thái trong MySQL
            savedTrack.setEsSyncStatus("Synced");
            audioTrackRepository.save(savedTrack); // Lưu đè lại trạng thái
        } catch (Exception e) {
            // Lỗi ở ES thì cứ để esSyncStatus là "Pending", sau này có thể viết job quét để đồng bộ lại.
            System.err.println("Lỗi đồng bộ Elasticsearch cho AudioTrack ID " + savedTrack.getId() + ": " + e.getMessage());
        }

        AudioTrackDTO dto = audioTrackMapper.toDto(savedTrack);
        enrichReviewStats(List.of(dto));
        return dto;
    }


    // ------------------------------ Các helper method cho chức năng upload -----------------------------

    // Đồng bộ hóa lên elastic server
    private void syncToElasticsearch(AudioTrack track, List<AudioTrackLicense> licenses) {
        // Dùng service index thống nhất để tránh ghi đè mất vector giữa các luồng sync khác nhau.
        audioTrackIndexingService.indexTrack(track, licenses);
    }

    // Xác thực người dùng hiện tại
    private User resolveCurrentArtist() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Cần đăng nhập để upload bài hát");
        }

        User user = Optional.ofNullable(userRepository.findByEmail(authentication.getName()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Người dùng không tồn tại"));

        String roleName = user.getRole() != null ? user.getRole().getName() : null;
        if (roleName == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tài khoản không có quyền upload bài hát");
        }

        String normalizedRole = roleName.toUpperCase(Locale.ROOT);
        if (!normalizedRole.contains("ARTIST") && !normalizedRole.contains("ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chỉ artist hoặc admin mới có quyền upload bài hát");
        }

        return user;
    }

    // Chuẩn hóa và kiểm tra dữ liệu văn bản bắt buộc
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

    // Chuẩn hóa dữ liệu văn bản tùy chọn (có thể để trống)
    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isBlank() ? null : normalized;
    }

    // Kiểm tra file upload hợp lệ và không được để trống (audio hoặc ảnh bìa)
    private void validateUploadFile(MultipartFile file, boolean audioFile) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    audioFile ? "Audio file không được để trống" : "Cover image không được để trống");
        }
    }

    // Tải genres
    private List<Genre> loadGenres(List<Integer> genreIds) {
        if (genreIds == null || genreIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần ít nhất 1 thể loại");
        }

        List<Genre> genres = new ArrayList<>();
        for (Integer genreId : new LinkedHashSet<>(genreIds)) {
            Genre genre = genreRepository.findById(genreId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Genre không tồn tại: " + genreId));
            genres.add(genre);
        }
        return genres;
    }

    // Tải moods
    private List<Mood> loadMoods(List<Integer> moodIds) {
        if (moodIds == null || moodIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần ít nhất 1 cảm xúc");
        }

        List<Mood> moods = new ArrayList<>();
        for (Integer moodId : new LinkedHashSet<>(moodIds)) {
            Mood mood = moodRepository.findById(moodId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mood không tồn tại: " + moodId));
            moods.add(mood);
        }
        return moods;
    }

    // Tải themes
    private List<Theme> loadThemes(List<Integer> themeIds) {
        if (themeIds == null || themeIds.isEmpty()) {
            return List.of();
        }

        List<Theme> themes = new ArrayList<>();
        for (Integer themeId : new LinkedHashSet<>(themeIds)) {
            Theme theme = themeRepository.findById(themeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Theme không tồn tại: " + themeId));
            themes.add(theme);
        }
        return themes;
    }

    // Tạo, kiểm tra và lưu danh sách license kèm giá cho bài hát
    private List<AudioTrackLicense> buildAndSaveLicenses(AudioTrack savedTrack, List<LicensePriceRequest> licensePrices) {
        if (licensePrices == null || licensePrices.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần ít nhất 1 license price");
        }

        Set<Integer> seenLicenseIds = new HashSet<>();
        List<AudioTrackLicense> trackLicenses = new ArrayList<>();

        for (LicensePriceRequest licensePrice : licensePrices) {
            if (licensePrice == null || licensePrice.getLicenseId() == null || licensePrice.getPrice() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thông tin license price không hợp lệ");
            }

            if (!seenLicenseIds.add(licensePrice.getLicenseId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "License id bị trùng: " + licensePrice.getLicenseId());
            }

            License license = licenseRepository.findById(licensePrice.getLicenseId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "License không tồn tại: " + licensePrice.getLicenseId()));

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

    // Tạo file preview có watermark và lưu vào hệ thống lưu trữ cloudinary
    private String createAndStorePreviewFile(MultipartFile originalFile) {
        Path previewFilePath = audioMixerService.createWatermarkedPreview(originalFile);
        try {
            return audioFileStorageService.storeWatermarkedPreview(previewFilePath);
        } finally {
            cleanupTempFile(previewFilePath);
        }
    }

    // Xóa file tạm sau khi đã lưu vào cloudinary
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

    // ------------------------------ Các method cho chức năng quản lý audio track-----------------------------

    // Cập nhật thông tin audio track
    @Transactional
    public AudioTrackDTO updateAudioTrack(Integer audioId, String updateRequestJson,
                                          MultipartFile newOriginalFile,
                                          MultipartFile newCoverImageFile) {
        if (audioId == null || audioId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio id không hợp lệ");
        }

        AudioTrack audioTrack = audioTrackRepository.findById(audioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio track không tồn tại"));

        UpdateAudioTrackRequest request = parseUpdateRequest(updateRequestJson);
        boolean hasAnyField = false;

        // Xử lý original audio file nếu có file mới
        if (newOriginalFile != null && !newOriginalFile.isEmpty()) {
            hasAnyField = true;
            validateUploadFile(newOriginalFile, true);
            String oldOriginalFileUrl = audioTrack.getOriginalFileUrl();
            String oldWatermarkedFileUrl = audioTrack.getWatermarkedFileUrl();

            String newOriginalFileUrl = audioFileStorageService.storeOriginalAudio(newOriginalFile);
            String newWatermarkedFileUrl = createAndStorePreviewFile(newOriginalFile);

            audioTrack.setOriginalFileUrl(newOriginalFileUrl);
            audioTrack.setWatermarkedFileUrl(newWatermarkedFileUrl);

            // Xóa file cũ trong background (non-fatal)
            if (oldOriginalFileUrl != null) {
                audioFileStorageService.deleteFileFromFirebase(oldOriginalFileUrl);
            }
            if (oldWatermarkedFileUrl != null) {
                audioFileStorageService.deleteFileFromFirebase(oldWatermarkedFileUrl);
            }
        }

        // Xử lý cover image nếu có file mới
        if (newCoverImageFile != null && !newCoverImageFile.isEmpty()) {
            hasAnyField = true;
            validateUploadFile(newCoverImageFile, false);
            String oldCoverImageUrl = audioTrack.getCoverImage();

            String newCoverImageUrl = audioFileStorageService.storeCoverImage(newCoverImageFile);
            audioTrack.setCoverImage(newCoverImageUrl);

            // Xóa ảnh cũ trong background (non-fatal)
            if (oldCoverImageUrl != null) {
                audioFileStorageService.deleteFileFromFirebase(oldCoverImageUrl);
            }
        }

        // Xử lý các field text từ request
        if (request != null) {
            if (request.getTitle() != null) {
                hasAnyField = true;
                String title = request.getTitle().trim();
                if (title.isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title không được để trống");
                }
                audioTrack.setTitle(title);
            }

            if (request.getAudioType() != null) {
                hasAnyField = true;
                String audioType = request.getAudioType().trim();
                if (audioType.isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio type không được để trống");
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
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author name không được để trống");
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
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duration phải lớn hơn 0");
                }
                audioTrack.setDuration(request.getDuration());
            }

        }

        if (!hasAnyField) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không có trường nào để cập nhật");
        }

        if (audioTrack.getStatus() == null || !"Need Revision".equalsIgnoreCase(audioTrack.getStatus())) {
            audioTrack.setStatus("Pending");
        }

        AudioTrack savedTrack = audioTrackRepository.save(audioTrack);
        AudioTrackDTO dto = audioTrackMapper.toDto(savedTrack);
        enrichReviewStats(List.of(dto));
        return dto;
    }

    // Xóa một audio track
    @Transactional
    public void deleteAudioTrack(Integer audioId) {
        if (audioId == null || audioId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio id không hợp lệ");
        }

        AudioTrack audioTrack = audioTrackRepository.findById(audioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio track không tồn tại"));

        try {
            audioTrackRepository.delete(audioTrack);
            audioTrackRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Không thể xóa vì audio track đang được sử dụng", ex);
        }
    }

    // Nộp lại audio track sau khi được yêu cầu chỉnh sửa
    @Transactional
    public AudioTrackDTO resubmitAudioTrack(Integer audioId) {
        if (audioId == null || audioId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio id khong hop le");
        }

        User currentArtist = resolveCurrentArtist();
        AudioTrack audioTrack = audioTrackRepository.findById(audioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio track khong ton tai"));

        if (audioTrack.getArtist() == null || audioTrack.getArtist().getId() == null
                || !audioTrack.getArtist().getId().equals(currentArtist.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền nộp lại bài hát này");
        }

        if (!"Need Revision".equalsIgnoreCase(audioTrack.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Chỉ có thể nộp lại bài hát ở trạng thái Need Revision");
        }

        audioTrack.setStatus("Pending");

        AudioTrack savedTrack = audioTrackRepository.save(audioTrack);
        AudioTrackDTO dto = audioTrackMapper.toDto(savedTrack);
        enrichReviewStats(List.of(dto));
        return dto;
    }

    // ------------------------------ Các helper method cho chức năng quản lý audio track-----------------------------

    // Chuyển đổi chuỗi JSON thành đối tượng UpdateAudioTrackRequest và kiểm tra tính hợp lệ
    private UpdateAudioTrackRequest parseUpdateRequest(String updateRequestJson) {
        if (updateRequestJson == null || updateRequestJson.isBlank()) {
            return null;
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(updateRequestJson, UpdateAudioTrackRequest.class);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Update request JSON khong hop le: " + ex.getMessage(), ex);
        }
    }


    // ------------------------------ Các method cho việc hiển thị trên user page -----------------------------

    @Transactional(readOnly = true)
    public List<AudioTrackDTO> getAllAudioTracks() {
        List<AudioTrack> tracks = audioTrackRepository.findByStatusIgnoreCase("APPROVED");
        List<AudioTrackDTO> dtos = audioTrackMapper.toDtoList(tracks);
        enrichReviewStats(dtos);
        return dtos;
    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getAudioTracksByGenreId(int idGenre, int page, int size, Double minPrice, Double maxPrice, List<String> types, List<Integer> artistIds, String sort) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<AudioTrack> spec = AudioTrackSpecification.filter(idGenre, null, null, minPrice, maxPrice, types, artistIds, sort, null);
        Page<AudioTrack> audioTrackPage = audioTrackRepository.findAll(spec, pageable);

        return createPageResponse(audioTrackPage);
    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getAudioTracksByMoodId(int idMood, int page, int size, Double minPrice, Double maxPrice, List<String> types, List<Integer> artistIds, String sort) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<AudioTrack> spec = AudioTrackSpecification.filter(null, idMood, null, minPrice, maxPrice, types, artistIds, sort, null);
        Page<AudioTrack> audioTrackPage = audioTrackRepository.findAll(spec, pageable);

        return createPageResponse(audioTrackPage);
    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getAudioTracksByThemeId(int idTheme, int page, int size, Double minPrice, Double maxPrice, List<String> types, List<Integer> artistIds, String sort) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<AudioTrack> spec = AudioTrackSpecification.filter(null, null, idTheme, minPrice, maxPrice, types, artistIds, sort, null);
        Page<AudioTrack> audioTrackPage = audioTrackRepository.findAll(spec, pageable);

        return createPageResponse(audioTrackPage);
    }

    @Transactional(readOnly = true)
    public AudioTrackDTO getAudioTrackById(int id) {
        AudioTrack audioTrack = audioTrackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audio track not found with id: " + id));
        AudioTrackDTO dto = audioTrackMapper.toDto(audioTrack);
        enrichReviewStats(List.of(dto));
        return dto;
    }

    @Transactional(readOnly = true)
    public AudioTrackPageResponse getAudioTracksByArtistId(int artistId, Integer genreId, int page, int size, Double minPrice, Double maxPrice, List<String> types, String sort, String status) {
        Pageable pageable = PageRequest.of(page, size);

        String genreName = null;
        if (genreId != null) {
            Genre genre = genreRepository.findById(genreId).orElse(null);
            genreName = genre != null ? genre.getName() : null;
        }

        Specification<AudioTrack> spec = AudioTrackSpecification.filterForArtist(artistId, null, genreName, minPrice, maxPrice, types, sort, status);
        Page<AudioTrack> audioTrackPage = audioTrackRepository.findAll(spec, pageable);

        return createPageResponse(audioTrackPage);
    }

    // Tăng play count của audio track khi người dùng nghe preview
    @Transactional
    public AudioTrackPlayCountResponse incrementPreviewPlayCount(Integer audioId) {
        if (audioId == null || audioId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio id không hợp lệ");
        }

        int updatedRows = audioTrackRepository.incrementPlayCount(audioId);
        if (updatedRows == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio track không tồn tại");
        }

        Integer playCount = audioTrackRepository.findPlayCountById(audioId);
        return AudioTrackPlayCountResponse.builder()
                .audioId(audioId)
                .playCount(playCount == null ? 0 : playCount)
                .build();
    }

    // ------------------------------ Các helper method cho việc hiển thị trên user page -----------------------------

    // Hàm helper để tạo response cho các API phân trang
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

    // Bổ sung thông tin đánh giá vào DTO
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
