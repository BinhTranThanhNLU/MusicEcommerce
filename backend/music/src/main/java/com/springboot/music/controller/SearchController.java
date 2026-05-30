package com.springboot.music.controller;

import com.springboot.music.document.AudioTrackDocument;
import com.springboot.music.requestmodel.AudioTrackSearchRequest;
import com.springboot.music.responsemodel.AudioTrackSearchResponse;
import com.springboot.music.service.AudioTrackSearchService;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/search")
public class SearchController {

    private final AudioTrackSearchService audioTrackSearchService;

    public SearchController(AudioTrackSearchService audioTrackSearchService) {
        this.audioTrackSearchService = audioTrackSearchService;
    }

    @PostMapping(value = "/melody", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AudioTrackSearchResponse> melodySearch(
            @RequestParam("audio") MultipartFile file,
            @RequestParam(defaultValue = "10") int size) {

        if (file == null || file.isEmpty() || size <= 0 || size > 100) {
            return ResponseEntity.badRequest().build();
        }

        try {
            SearchHits<AudioTrackDocument> searchHits = audioTrackSearchService.melodySearch(file, size);

            List<AudioTrackDocument> results = searchHits.stream()
                    .map(hit -> hit.getContent())
                    .collect(Collectors.toList());

            AudioTrackSearchResponse response = new AudioTrackSearchResponse(
                    results,
                    0,
                    size,
                    searchHits.getTotalHits(),
                    "melody",
                    "file: " + file.getOriginalFilename()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Ném lỗi 500 nếu Python server sập hoặc lỗi trích xuất
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/full-text")
    public ResponseEntity<AudioTrackSearchResponse> fullTextSearch(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        if (q == null || q.trim().isEmpty() || page < 0 || size <= 0 || size > 100) {
            return ResponseEntity.badRequest().build();
        }

        // Nhận về SearchHits
        SearchHits<AudioTrackDocument> searchHits = audioTrackSearchService.fullTextSearch(q, page, size);

        // Bóc tách List dữ liệu
        List<AudioTrackDocument> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        // Lấy TỔNG SỐ BẢN GHI thực tế từ ES
        long totalHits = searchHits.getTotalHits();

        AudioTrackSearchResponse response = new AudioTrackSearchResponse(
                results, page, size, totalHits, "full-text", q
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/fuzzy")
    public ResponseEntity<AudioTrackSearchResponse> fuzzySearch(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (page < 0 || size <= 0 || size > 100) {
            return ResponseEntity.badRequest().build();
        }

        SearchHits<AudioTrackDocument> searchHits = audioTrackSearchService.fuzzySearch(q, page, size);

        List<AudioTrackDocument> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        long totalHits = searchHits.getTotalHits();

        AudioTrackSearchResponse response = new AudioTrackSearchResponse(
                results, page, size, totalHits, "fuzzy", q
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/phrase")
    public ResponseEntity<AudioTrackSearchResponse> phraseSearch(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (page < 0 || size <= 0 || size > 100) {
            return ResponseEntity.badRequest().build();
        }

        SearchHits<AudioTrackDocument> searchHits = audioTrackSearchService.phraseSearch(q, page, size);

        List<AudioTrackDocument> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        long totalHits = searchHits.getTotalHits();

        AudioTrackSearchResponse response = new AudioTrackSearchResponse(
                results, page, size, totalHits, "phrase", q
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/advanced")
    public ResponseEntity<AudioTrackSearchResponse> advancedSearch(
            @RequestBody AudioTrackSearchRequest request) {

        if (request == null || request.getPage() < 0
                || request.getSize() <= 0 || request.getSize() > 100) {
            return ResponseEntity.badRequest().build();
        }

        SearchHits<AudioTrackDocument> searchHits =
                audioTrackSearchService.advancedSearch(
                        request.getKeyword(),
                        request.getStatus(),
                        request.getGenres(),
                        request.getMoods(),
                        request.getThemes(),
                        request.getMinPrice(),
                        request.getMaxPrice(),
                        request.getPage(),
                        request.getSize()
                );

        List<AudioTrackDocument> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        long totalHits = searchHits.getTotalHits();

        AudioTrackSearchResponse response = new AudioTrackSearchResponse(
                results,
                request.getPage(),
                request.getSize(),
                totalHits,
                "advanced",
                request.getKeyword()
        );

        return ResponseEntity.ok(response);
    }


    @PostMapping("/filter")
    public ResponseEntity<AudioTrackSearchResponse> filterByMultipleCriteria(
            @RequestBody AudioTrackSearchRequest request) {

        if (request == null || request.getPage() < 0
                || request.getSize() <= 0 || request.getSize() > 100) {
            return ResponseEntity.badRequest().build();
        }

        SearchHits<AudioTrackDocument> searchHits =
                audioTrackSearchService.filterByMultipleCriteria(
                        request.getStatus(),
                        request.getGenres(),
                        request.getMoods(),
                        request.getThemes(),
                        request.getMinPrice(),
                        request.getMaxPrice(),
                        request.getPage(),
                        request.getSize()
                );

        List<AudioTrackDocument> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        long totalHits = searchHits.getTotalHits();

        AudioTrackSearchResponse response = new AudioTrackSearchResponse(
                results,
                request.getPage(),
                request.getSize(),
                totalHits,
                "filter",
                null
        );

        return ResponseEntity.ok(response);
    }


    @GetMapping("/autocomplete")
    public ResponseEntity<List<AudioTrackDocument>> autocomplete(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "10") int limit) {

        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (limit <= 0 || limit > 100) {
            return ResponseEntity.badRequest().build();
        }

        SearchHits<AudioTrackDocument> searchHits =
                audioTrackSearchService.autocomplete(q, limit);

        List<AudioTrackDocument> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }

    @GetMapping("/semantic")
    public ResponseEntity<AudioTrackSearchResponse> semanticSearch(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "10") int size) {

        if (q == null || q.trim().isEmpty() || size <= 0 || size > 100) {
            return ResponseEntity.badRequest().build();
        }

        SearchHits<AudioTrackDocument> searchHits = audioTrackSearchService.semanticSearch(q, size);

        List<AudioTrackDocument> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        AudioTrackSearchResponse response = new AudioTrackSearchResponse(
                results, 0, size, searchHits.getTotalHits(), "semantic", q
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/hybrid")
    public ResponseEntity<AudioTrackSearchResponse> hybridSearch(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        if (q == null || q.trim().isEmpty() || page < 0 || size <= 0 || size > 100) {
            return ResponseEntity.badRequest().build();
        }

        // Gọi method hybrid mới
        SearchHits<AudioTrackDocument> searchHits = audioTrackSearchService.hybridSearch(q, page, size);

        List<AudioTrackDocument> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        long totalHits = searchHits.getTotalHits();
        AudioTrackSearchResponse response = new AudioTrackSearchResponse(
                results, page, size, totalHits, "hybrid", q
        );

        return ResponseEntity.ok(response);
    }
}


