package com.springboot.music.controller;

import com.springboot.music.dto.GenreDTO;
import com.springboot.music.dto.MoodDTO;
import com.springboot.music.service.GenreService;
import com.springboot.music.service.MoodService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/moods")
@Tag(name = "Moods", description = "Các API liên quan đến cảm xúc")
public class MoodController {

    private final MoodService moodService;

    public MoodController(MoodService moodService) {
        this.moodService = moodService;
    }

    @GetMapping
    public ResponseEntity<List<MoodDTO>> getAllGenres() {
        return ResponseEntity.ok(moodService.getAllMoods());
    }

}
