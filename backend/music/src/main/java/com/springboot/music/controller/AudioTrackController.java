package com.springboot.music.controller;

import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.requestmodel.CreateAudioTrackRequest;
import com.springboot.music.requestmodel.UpdateAudioTrackRequest;
import com.springboot.music.responsemodel.AudioTrackPageResponse;
import com.springboot.music.responsemodel.AudioTrackPlayCountResponse;
import com.springboot.music.service.AudioTrackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/audio-tracks")
@Tag(name = "Audio Tracks", description = "Các API liên quan đến bài hát/âm thanh")
public class AudioTrackController {

    private final AudioTrackService audioTrackService;

    public AudioTrackController(AudioTrackService audioTrackService) {
        this.audioTrackService = audioTrackService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả Audio Track", description = "Trả về danh sách các bài hát cùng thông tin nghệ sĩ, giá khởi điểm và các thẻ tags.")
    public ResponseEntity<List<AudioTrackDTO>> getAllAudioTracks() {
        List<AudioTrackDTO> responseList = audioTrackService.getAllAudioTracks();
        return ResponseEntity.ok(responseList);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload audio track", description = "Nhan file nhac goc, cover image va metadata de tao moi audio track trang thai Pending.")
    public ResponseEntity<AudioTrackDTO> uploadAudioTrack(
            @Valid @RequestPart("metadata") CreateAudioTrackRequest metadata,
            @RequestPart("originalFile") MultipartFile originalFile,
            @RequestPart("coverImage") MultipartFile coverImage) {
        return ResponseEntity.ok(audioTrackService.createAudioTrack(metadata, originalFile, coverImage));
    }

    @GetMapping("/genre/{id}")
    public ResponseEntity<AudioTrackPageResponse> getTracksByGenre(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<String> types,
            @RequestParam(required = false) List<Integer> artistIds,
            @RequestParam(required = false) String sort) {

        AudioTrackPageResponse response = audioTrackService.getAudioTracksByGenreId(id, page, size, minPrice, maxPrice, types, artistIds, sort);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/mood/{id}")
    public ResponseEntity<AudioTrackPageResponse> getTracksByMood(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<String> types,
            @RequestParam(required = false) List<Integer> artistIds,
            @RequestParam(required = false) String sort) {

        AudioTrackPageResponse response = audioTrackService.getAudioTracksByMoodId(id, page, size, minPrice, maxPrice, types, artistIds, sort);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/theme/{id}")
    public ResponseEntity<AudioTrackPageResponse> getTracksByTheme(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<String> types,
            @RequestParam(required = false) List<Integer> artistIds,
            @RequestParam(required = false) String sort) {

        AudioTrackPageResponse response = audioTrackService.getAudioTracksByThemeId(id, page, size, minPrice, maxPrice, types, artistIds, sort);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AudioTrackDTO> getAudioTrackById(@PathVariable int id) {
        AudioTrackDTO audioTrackDTO = audioTrackService.getAudioTrackById(id);
        return ResponseEntity.ok(audioTrackDTO);
    }

    @GetMapping("/artist/{id}")
    public ResponseEntity<AudioTrackPageResponse> getTracksByArtist(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size, // Lấy 7 bài để xíu nữa Frontend trừ đi bài hiện tại là vừa đẹp 6 bài
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<String> types,
            @RequestParam(required = false) String sort) {

        AudioTrackPageResponse response = audioTrackService.getAudioTracksByArtistId(id, page, size, minPrice, maxPrice, types, sort);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/preview-play")
    public ResponseEntity<AudioTrackPlayCountResponse> incrementPreviewPlayCount(@PathVariable Integer id) {
        return ResponseEntity.ok(audioTrackService.incrementPreviewPlayCount(id));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update audio track", description = "Cap nhat audio track voi ho tro multipart form data. Cac field text va image/audio file (optional).")
    public ResponseEntity<AudioTrackDTO> updateAudioTrack(
            @PathVariable Integer id,
            @RequestPart(name = "updateRequest", required = true) String updateRequestJson,
            @RequestPart(name = "originalFile", required = false) MultipartFile originalFile,
            @RequestPart(name = "coverImage", required = false) MultipartFile coverImage) {
        return ResponseEntity.ok(audioTrackService.updateAudioTrack(id, updateRequestJson, originalFile, coverImage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAudioTrack(@PathVariable Integer id) {
        audioTrackService.deleteAudioTrack(id);
        return ResponseEntity.ok("Audio track deleted successfully");
    }

}

