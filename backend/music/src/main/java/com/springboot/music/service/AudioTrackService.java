package com.springboot.music.service;

import com.springboot.music.document.AudioTrackDocument;
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
import java.util.stream.Collectors;

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
    private final AudioTrackSearchRepository audioTrackSearchRepository;

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
                             AudioTrackSearchRepository audioTrackSearchRepository) {
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
        this.audioTrackSearchRepository = audioTrackSearchRepository;
    }

    // ------------------------------ Các api cho việc hiển thị trên user page -----------------------------

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

    // Lấy chi tiết một audio track theo id, kèm thông tin đánh giá
    @Transactional(readOnly = true)
    public AudioTrackDTO getAudioTrackById(int id) {
        AudioTrack audioTrack = audioTrackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audio track not found with id: " + id));
        AudioTrackDTO dto = audioTrackMapper.toDto(audioTrack);
        enrichReviewStats(List.of(dto));
        return dto;
    }

    // Lấy audio track theo artist id với phân trang và filter nâng cao, đồng thời chỉ truyền artistId hiện tại vào Specification để đảm bảo chỉ lấy bài hát của artist đó
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

    // Tạo mới một audio track, kèm xử lý upload file và tạo preview
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

    // Giải quyết người dùng hiện tại từ context bảo mật, đồng thời kiểm tra vai trò và tồn tại của người dùng
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

    // Chuẩn hóa và validate các trường text bắt buộc, đồng thời trả về giá trị đã được trim
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

    // Chuẩn hóa các trường text tùy chọn, nếu null hoặc chỉ chứa whitespace thì trả về null
    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isBlank() ? null : normalized;
    }

    // Validate file upload, đảm bảo file không null và không rỗng, đồng thời phân biệt giữa audio file và cover image để trả về thông báo lỗi phù hợp
    private void validateUploadFile(MultipartFile file, boolean audioFile) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    audioFile ? "Audio file khong duoc de trong" : "Cover image khong duoc de trong");
        }
    }

    private List<Genre> loadGenres(List<Integer> genreIds) {
        if (genreIds == null || genreIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần ít nhất 1 thể loại");
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can it nhat 1 cảm xúc");
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
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Theme không tồn tại: " + themeId));
            themes.add(theme);
        }
        return themes;
    }

    // Xử lý thông tin license price từ request
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

    // Tạo file preview có watermark từ file gốc, lưu vào storage và trả về URL
    private String createAndStorePreviewFile(MultipartFile originalFile) {
        Path previewFilePath = audioMixerService.createWatermarkedPreview(originalFile);
        try {
            return audioFileStorageService.storeWatermarkedPreview(previewFilePath);
        } finally {
            cleanupTempFile(previewFilePath);
        }
    }

    // Xóa file tạm nếu tồn tại
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

    // Làm tròn điểm đánh giá trung bình đến 1 chữ số thập phân để hiển thị đẹp hơn
    private double roundOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    // Tăng play count của audio track khi người dùng nghe preview, đồng thời trả về play count mới sau khi đã tăng
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

    // Cập nhật thông tin audio track
    @Transactional
    public AudioTrackDTO updateAudioTrack(Integer audioId, String updateRequestJson,
                                          MultipartFile newOriginalFile,
                                          MultipartFile newCoverImageFile) {
        if (audioId == null || audioId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio id khong hop le");
        }

        AudioTrack audioTrack = audioTrackRepository.findById(audioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio track khong ton tai"));

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

        }

        if (!hasAnyField) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can it nhat 1 truong de cap nhat");
        }

        if (audioTrack.getStatus() == null || !"Need Revision".equalsIgnoreCase(audioTrack.getStatus())) {
            audioTrack.setStatus("Pending");
        }

        AudioTrack savedTrack = audioTrackRepository.save(audioTrack);
        AudioTrackDTO dto = audioTrackMapper.toDto(savedTrack);
        enrichReviewStats(List.of(dto));
        return dto;
    }

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


    // Phân tích JSON string thành UpdateAudioTrackRequest object, đồng thời xử lý lỗi nếu JSON không hợp lệ
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

    // Xóa một audio track, đồng thời xử lý lỗi nếu audio track đang được sử dụng trong dữ liệu
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

    private void syncToElasticsearch(AudioTrack track, List<AudioTrackLicense> licenses) {
        AudioTrackDocument esDoc = new AudioTrackDocument();

        // 1. Ánh xạ các trường cơ bản
        esDoc.setId(String.valueOf(track.getId())); // Ép kiểu Integer của MySQL sang String của ES
        esDoc.setTitle(track.getTitle());
        esDoc.setArtistName(track.getArtist().getName());
        esDoc.setAudioType(track.getAudioType());
        esDoc.setDescription(track.getDescription());
        esDoc.setLyrics(track.getLyrics());
        esDoc.setStatus(track.getStatus());
        esDoc.setPlayCount(track.getPlayCount());
        esDoc.setCoverImage(track.getCoverImage());
        esDoc.setUploadDate(track.getUploadDate());

        // 2. Làm phẳng dữ liệu (Flattening) các danh sách (Thể loại, Cảm xúc, Chủ đề)
        esDoc.setGenres(track.getGenres().stream()
                .map(Genre::getName)
                .collect(Collectors.toList()));

        esDoc.setMoods(track.getMoods().stream()
                .map(Mood::getName)
                .collect(Collectors.toList()));

        esDoc.setThemes(track.getThemes().stream()
                .map(Theme::getName)
                .collect(Collectors.toList()));

        // 3. Xử lý khoảng giá VNĐ (Lấy tất cả các mức giá của bài hát này)
        List<Long> priceList = licenses.stream()
                .map(license -> license.getPrice().longValue()) // BigDecimal chuyển sang Long
                .collect(Collectors.toList());
        esDoc.setPricesVnd(priceList);

        // 4. Lưu vào Elasticsearch
        audioTrackSearchRepository.save(esDoc);
    }

}
