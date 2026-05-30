package com.springboot.music.controller;

import com.springboot.music.entity.AudioTrack;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.service.AudioTrackIndexingService;
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
import java.util.stream.IntStream;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/v1/admin/sync")
public class ElasticSyncController {

    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackIndexingService audioTrackIndexingService;

    public ElasticSyncController(AudioTrackRepository audioTrackRepository,
                                 AudioTrackIndexingService audioTrackIndexingService) {
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackIndexingService = audioTrackIndexingService;
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
                audioTrackIndexingService.indexTrack(track, track.getLicenses());
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
}
