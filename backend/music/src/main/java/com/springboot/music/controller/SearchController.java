package com.springboot.music.controller;

import com.springboot.music.document.AudioTrackDocument;
import com.springboot.music.requestmodel.AudioTrackSearchRequest;
import com.springboot.music.responsemodel.AudioTrackSearchResponse;
import com.springboot.music.service.AudioTrackSearchService;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/search")
public class SearchController {

    private final AudioTrackSearchService audioTrackSearchService;

    public SearchController(AudioTrackSearchService audioTrackSearchService) {
        this.audioTrackSearchService = audioTrackSearchService;
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
}


