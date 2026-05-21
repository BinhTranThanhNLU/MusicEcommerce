package com.springboot.music.controller;

import com.springboot.music.document.AudioTrackDocument;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.AudioTrackLicense;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.AudioTrackSearchRepository;
import com.springboot.music.service.SemanticSearchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/v1/admin/sync")
public class ElasticSyncController {

    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackSearchRepository audioTrackESRepository;
    private final SemanticSearchService semanticSearchService;

    public ElasticSyncController(AudioTrackRepository audioTrackRepository, AudioTrackSearchRepository audioTrackESRepository, SemanticSearchService semanticSearchService) {
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackESRepository = audioTrackESRepository;
        this.semanticSearchService = semanticSearchService;
    }

    @Transactional(readOnly = true)
    @PostMapping("/audio-tracks")
    public ResponseEntity<String> syncAudioTracks(
            @RequestParam(defaultValue = "1") Integer startId,
            @RequestParam(defaultValue = "33") Integer endId) {

        if (startId == null || endId == null || startId <= 0 || endId <= 0) {
            return ResponseEntity.badRequest().body("startId và endId phải là số dương.");
        }

        if (startId > endId) {
            return ResponseEntity.badRequest().body("startId phải nhỏ hơn hoặc bằng endId.");
        }

        List<Integer> ids = IntStream.rangeClosed(startId, endId)
                .boxed()
                .toList();

        List<AudioTrack> tracks = StreamSupport.stream(audioTrackRepository.findAllById(ids).spliterator(), false)
                .sorted(Comparator.comparing(AudioTrack::getId))
                .toList();

        if (tracks.isEmpty()) {
            return ResponseEntity.ok("Không có audio track nào trong khoảng ID " + startId + " đến " + endId + " để sync.");
        }

        List<Integer> failedIds = new ArrayList<>();
        int syncedCount = 0;

        for (AudioTrack track : tracks) {
            try {
                AudioTrackDocument doc = toDocument(track);

                // KIỂM TRA CHẶN LỖI: Nếu AI trả về null thì đánh dấu là lỗi, không lưu vào ES
                if (doc.getEmbeddingVector() == null || doc.getEmbeddingVector().isEmpty()) {
                    throw new RuntimeException("Không lấy được Vector từ Hugging Face");
                }

                audioTrackESRepository.save(doc);
                syncedCount++;

                // NGỦ 5 GIÂY TRƯỚC KHI GỌI TIẾP (Tránh spam API Hugging Face)
                Thread.sleep(100);

            } catch (Exception ex) {
                System.err.println("Lỗi ở ID " + track.getId() + ": " + ex.getMessage());
                failedIds.add(track.getId());
            }
        }

        String message = "Đã sync " + syncedCount + "/" + tracks.size() + " track từ ID " + startId + " đến " + endId;
        if (!failedIds.isEmpty()) {
            message += ". Các ID lỗi: " + failedIds;
            return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(message);
        }

        return ResponseEntity.ok(message);
    }

    private AudioTrackDocument toDocument(AudioTrack track) {
        AudioTrackDocument document = new AudioTrackDocument();
        document.setId(String.valueOf(track.getId()));
        document.setTitle(track.getTitle());
        document.setArtistName(track.getArtist() != null ? track.getArtist().getName() : null);
        document.setAudioType(track.getAudioType());
        document.setDescription(track.getDescription());
        document.setLyrics(track.getLyrics());
        document.setStatus(track.getStatus());
        document.setGenres(extractNames(track.getGenres()));
        document.setMoods(extractNames(track.getMoods()));
        document.setThemes(extractNames(track.getThemes()));
        document.setPricesVnd(extractPrices(track.getLicenses()));
        document.setPlayCount(track.getPlayCount());
        document.setCoverImage(track.getCoverImage());
        document.setUploadDate(track.getUploadDate());

        String textToEmbed = track.getTitle() + " " +
                (track.getArtist() != null ? track.getArtist().getName() : "") + " " +
                String.join(" ", extractNames(track.getGenres())) + " " +
                String.join(" ", extractNames(track.getMoods())) + " " +
                String.join(" ", extractNames(track.getThemes())) + " " +
                (track.getDescription() != null ? track.getDescription() : "");

        // Gọi AI của Bách Khoa để dịch chuỗi này sang mảng 768 số thực
        List<Double> vector = semanticSearchService.getEmbedding(textToEmbed);
        document.setEmbeddingVector(vector);

        return document;
    }

    private <T> List<String> extractNames(List<T> items) {
        if (items == null || items.isEmpty()) {
            return List.of();
        }

        return items.stream()
                .map(item -> {
                    if (item instanceof com.springboot.music.entity.Genre genre) {
                        return genre.getName();
                    }
                    if (item instanceof com.springboot.music.entity.Mood mood) {
                        return mood.getName();
                    }
                    if (item instanceof com.springboot.music.entity.Theme theme) {
                        return theme.getName();
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private List<Long> extractPrices(List<AudioTrackLicense> licenses) {
        if (licenses == null || licenses.isEmpty()) {
            return List.of();
        }

        return licenses.stream()
                .map(AudioTrackLicense::getPrice)
                .filter(Objects::nonNull)
                .map(price -> price.longValue())
                .collect(Collectors.toList());
    }
}
