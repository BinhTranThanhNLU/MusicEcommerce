package com.springboot.music.controller;

import com.springboot.music.document.AudioTrackDocument;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.repository.AudioTrackSearchRepository;
import com.springboot.music.service.MelodyExtractionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/v1/admin/sync")
public class MelodySyncController {

    private final AudioTrackRepository audioTrackRepository;
    private final AudioTrackSearchRepository audioTrackESRepository;
    private final MelodyExtractionService melodyExtractionService;

    public MelodySyncController(AudioTrackRepository audioTrackRepository,
                                AudioTrackSearchRepository audioTrackESRepository,
                                MelodyExtractionService melodyExtractionService) {
        this.audioTrackRepository = audioTrackRepository;
        this.audioTrackESRepository = audioTrackESRepository;
        this.melodyExtractionService = melodyExtractionService;
    }

    @PostMapping("/melody-vectors")
    public ResponseEntity<String> syncMelodyVectors(
            @RequestParam(defaultValue = "1") Integer startId,
            @RequestParam(defaultValue = "33") Integer endId) {

        if (startId == null || endId == null || startId <= 0 || endId <= 0) {
            return ResponseEntity.badRequest().body("startId và endId phải là số dương.");
        }
        if (startId > endId) {
            return ResponseEntity.badRequest().body("startId phải nhỏ hơn hoặc bằng endId.");
        }

        List<Integer> ids = IntStream.rangeClosed(startId, endId).boxed().collect(Collectors.toList());
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
                // 1. Lấy URL file nhạc (Giả sử bạn dùng trường url hoặc audioFile)
                // THAY ĐỔI tên phương thức getAudioUrl() cho đúng với Entity của bạn
                String cloudinaryUrl = track.getOriginalFileUrl();
                if (cloudinaryUrl == null || cloudinaryUrl.isEmpty()) {
                    throw new RuntimeException("Track không có file audio trên Cloudinary");
                }

                // 2. Gọi sang Service tải file và đẩy qua Python lấy vector 92 chiều
                List<Double> melodyVector = melodyExtractionService.extractVectorFromUrl(cloudinaryUrl);

                if (melodyVector == null || melodyVector.size() != 92) {
                    throw new RuntimeException("Vector trả về không hợp lệ hoặc không đủ 92 chiều");
                }

                double[] melodyArray = melodyVector.stream().mapToDouble(Double::doubleValue).toArray();

                // 3. Tìm Document CÓ SẴN trong Elasticsearch để cập nhật (Không tạo mới để giữ nguyên Semantic Search)
                AudioTrackDocument doc = audioTrackESRepository.findById(String.valueOf(track.getId()))
                        .orElseThrow(() -> new RuntimeException("Chưa có Document trong ES. Hãy chạy Sync Semantic trước!"));

                System.out.println("Kích thước vector: " + melodyVector.size());

                // 4. Cập nhật và lưu lại
                doc.setMelodyVector(melodyArray);
                audioTrackESRepository.save(doc);
                syncedCount++;

                // NGỦ 1 GIÂY (Tránh làm cháy CPU của service Python khi phân tích âm thanh liên tục)
                Thread.sleep(1000);

            } catch (Exception ex) {
                System.err.println("Lỗi đồng bộ giai điệu ở ID " + track.getId() + ": " + ex.getMessage());
                failedIds.add(track.getId());
            }
        }

        String message = "Đã sync giai điệu " + syncedCount + "/" + tracks.size() + " track từ ID " + startId + " đến " + endId;
        if (!failedIds.isEmpty()) {
            message += ". Các ID lỗi: " + failedIds;
            return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(message);
        }

        return ResponseEntity.ok(message);
    }
}
