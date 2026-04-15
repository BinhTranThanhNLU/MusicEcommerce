package com.springboot.music.controller;

import com.springboot.music.dto.ArtistDTO;
import com.springboot.music.service.ArtistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artists")
@Tag(name = "Artists", description = "Các API liên quan đến nghệ sĩ")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @GetMapping
    public ResponseEntity<List<ArtistDTO>> getAllArtists() {
        return ResponseEntity.ok(artistService.getAllArtists());
    }
}