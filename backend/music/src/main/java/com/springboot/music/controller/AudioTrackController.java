package com.springboot.music.controller;

import com.springboot.music.dto.AudioTrackDTO;
import com.springboot.music.repository.AudioTrackRepository;
import com.springboot.music.service.AudioTrackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/tracks")
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


}

