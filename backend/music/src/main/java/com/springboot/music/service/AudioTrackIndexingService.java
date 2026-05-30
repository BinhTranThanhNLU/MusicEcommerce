package com.springboot.music.service;

import com.springboot.music.document.AudioTrackDocument;
import com.springboot.music.entity.AudioTrack;
import com.springboot.music.entity.AudioTrackLicense;
import com.springboot.music.entity.Genre;
import com.springboot.music.entity.Mood;
import com.springboot.music.entity.Theme;
import com.springboot.music.repository.AudioTrackSearchRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AudioTrackIndexingService {

    private static final int EMBEDDING_DIM = 768;
    private static final int MELODY_DIM = 92;

    private final AudioTrackSearchRepository audioTrackSearchRepository;
    private final SemanticSearchService semanticSearchService;
    private final MelodyExtractionService melodyExtractionService;

    public AudioTrackIndexingService(AudioTrackSearchRepository audioTrackSearchRepository,
                                     SemanticSearchService semanticSearchService,
                                     MelodyExtractionService melodyExtractionService) {
        this.audioTrackSearchRepository = audioTrackSearchRepository;
        this.semanticSearchService = semanticSearchService;
        this.melodyExtractionService = melodyExtractionService;
    }

    public AudioTrackDocument indexTrack(AudioTrack track, List<AudioTrackLicense> licenses) {
        String trackId = String.valueOf(track.getId());
        AudioTrackDocument existingDoc = audioTrackSearchRepository.findById(trackId).orElse(null);

        AudioTrackDocument doc = new AudioTrackDocument();
        doc.setId(trackId);
        doc.setTitle(track.getTitle());
        doc.setArtistName(track.getArtist() != null ? track.getArtist().getName() : null);
        doc.setAudioType(track.getAudioType());
        doc.setDescription(track.getDescription());
        doc.setLyrics(track.getLyrics());
        doc.setStatus(track.getStatus());
        doc.setPlayCount(track.getPlayCount());
        doc.setCoverImage(track.getCoverImage());
        doc.setUploadDate(track.getUploadDate());
        doc.setGenres(extractGenreNames(track));
        doc.setMoods(extractMoodNames(track));
        doc.setThemes(extractThemeNames(track));
        doc.setPricesVnd(extractPrices(licenses));

        doc.setEmbeddingVector(resolveEmbeddingVector(track, existingDoc));
        doc.setMelodyVector(resolveMelodyVector(track, existingDoc));

        return audioTrackSearchRepository.save(doc);
    }

    private List<Double> resolveEmbeddingVector(AudioTrack track, AudioTrackDocument existingDoc) {
        try {
            List<Double> embedding = semanticSearchService.getEmbedding(buildEmbeddingText(track));
            if (embedding != null && embedding.size() == EMBEDDING_DIM) {
                return embedding;
            }
        } catch (Exception ex) {
            System.err.println("Loi khi tao embedding vector cho AudioTrack ID " + track.getId() + ": " + ex.getMessage());
        }

        if (existingDoc != null && existingDoc.getEmbeddingVector() != null && existingDoc.getEmbeddingVector().size() == EMBEDDING_DIM) {
            return List.copyOf(existingDoc.getEmbeddingVector());
        }

        return null;
    }

    private double[] resolveMelodyVector(AudioTrack track, AudioTrackDocument existingDoc) {
        try {
            List<Double> melody = melodyExtractionService.extractVectorFromUrl(track.getOriginalFileUrl());
            if (melody != null && melody.size() == MELODY_DIM) {
                double[] arr = new double[MELODY_DIM];
                for (int i = 0; i < MELODY_DIM; i++) {
                    Double v = melody.get(i);
                    arr[i] = v == null ? 0.0d : v;
                }
                return arr;
            }
        } catch (Exception ex) {
            System.err.println("Loi khi trich xuat melody vector cho AudioTrack ID " + track.getId() + ": " + ex.getMessage());
        }

        if (existingDoc != null && existingDoc.getMelodyVector() != null && existingDoc.getMelodyVector().length == MELODY_DIM) {
            return existingDoc.getMelodyVector().clone();
        }

        return null;
    }

    private String buildEmbeddingText(AudioTrack track) {
        String title = track.getTitle() == null ? "" : track.getTitle();
        String artistName = track.getArtist() != null && track.getArtist().getName() != null ? track.getArtist().getName() : "";
        String description = track.getDescription() == null ? "" : track.getDescription();

        return title + " "
                + artistName + " "
                + String.join(" ", extractGenreNames(track)) + " "
                + String.join(" ", extractMoodNames(track)) + " "
                + String.join(" ", extractThemeNames(track)) + " "
                + description;
    }

    private List<String> extractGenreNames(AudioTrack track) {
        if (track.getGenres() == null || track.getGenres().isEmpty()) {
            return List.of();
        }
        return track.getGenres().stream().map(Genre::getName).filter(Objects::nonNull).toList();
    }

    private List<String> extractMoodNames(AudioTrack track) {
        if (track.getMoods() == null || track.getMoods().isEmpty()) {
            return List.of();
        }
        return track.getMoods().stream().map(Mood::getName).filter(Objects::nonNull).toList();
    }

    private List<String> extractThemeNames(AudioTrack track) {
        if (track.getThemes() == null || track.getThemes().isEmpty()) {
            return List.of();
        }
        return track.getThemes().stream().map(Theme::getName).filter(Objects::nonNull).toList();
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

