package com.springboot.music.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class AudioMixerService {

    private final Resource watermarkResource;
    private final String ffmpegBinaryPath;
    private final int watermarkIntervalSeconds;
    private final double beepActiveSeconds;
    private final double originalVolume;
    private final double watermarkVolume;

    public AudioMixerService(
            @Value("classpath:watermark/watermark.mp3") Resource watermarkResource,
            @Value("${app.ffmpeg.binary-path:ffmpeg}") String ffmpegBinaryPath,
            @Value("${app.ffmpeg.watermark-interval-seconds:10}") int watermarkIntervalSeconds,
            @Value("${app.ffmpeg.beep-active-seconds:0.35}") double beepActiveSeconds,
            @Value("${app.ffmpeg.original-volume:0.75}") double originalVolume,
            @Value("${app.ffmpeg.watermark-volume:1.0}") double watermarkVolume) {
        this.watermarkResource = watermarkResource;
        this.ffmpegBinaryPath = ffmpegBinaryPath;
        this.watermarkIntervalSeconds = watermarkIntervalSeconds;
        this.beepActiveSeconds = beepActiveSeconds;
        this.originalVolume = originalVolume;
        this.watermarkVolume = watermarkVolume;
    }

    public Path createWatermarkedPreview(MultipartFile originalAudioFile) {
        if (originalAudioFile == null || originalAudioFile.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Audio file khong duoc de trong");
        }
        if (!watermarkResource.exists()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Khong tim thay file watermark tai resources/watermark/watermark.mp3");
        }

        Path originalTempFile = null;
        Path watermarkTempFile = null;
        Path previewTempFile = null;

        try {
            String originalExtension = extractExtension(originalAudioFile.getOriginalFilename());
            originalTempFile = Files.createTempFile("audio-original-", originalExtension);
            previewTempFile = Files.createTempFile("audio-preview-", ".mp3");
            watermarkTempFile = Files.createTempFile("audio-watermark-", ".mp3");

            originalAudioFile.transferTo(originalTempFile);
            try (InputStream watermarkStream = watermarkResource.getInputStream()) {
                Files.copy(watermarkStream, watermarkTempFile, StandardCopyOption.REPLACE_EXISTING);
            }

            ProcessBuilder processBuilder = new ProcessBuilder(buildFfmpegCommand(
                    originalTempFile,
                    watermarkTempFile,
                    previewTempFile
            ));
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            String ffmpegOutput;
            try (InputStream processOutput = process.getInputStream()) {
                ffmpegOutput = new String(processOutput.readAllBytes(), StandardCharsets.UTF_8);
            }

            int exitCode = process.waitFor();
            if (exitCode != 0 || !Files.exists(previewTempFile) || Files.size(previewTempFile) == 0) {
                cleanupFile(previewTempFile);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Tao file preview that bai bang FFmpeg. Chi tiet: " + abbreviate(ffmpegOutput));
            }

            return previewTempFile;
        } catch (IOException ex) {
            cleanupFile(previewTempFile);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Loi xu ly watermark audio", ex);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            cleanupFile(previewTempFile);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Tien trinh FFmpeg bi gian doan", ex);
        } finally {
            cleanupFile(originalTempFile);
            cleanupFile(watermarkTempFile);
        }
    }

    private List<String> buildFfmpegCommand(Path originalFile, Path watermarkFile, Path previewFile) {
        int interval = watermarkIntervalSeconds <= 0 ? 10 : watermarkIntervalSeconds;
        double activeSeconds = beepActiveSeconds <= 0 ? 0.35 : beepActiveSeconds;
        double baseVolume = originalVolume <= 0 ? 0.75 : originalVolume;
        double beepVolume = watermarkVolume <= 0 ? 1.0 : watermarkVolume;

        String filterComplex = String.format(Locale.US,
                "[0:a]volume=%f[a0];[1:a]volume=%f,volume=if(lt(mod(t\\,%d)\\,%f)\\,1\\,0)[wm];[a0][wm]amix=inputs=2:duration=first:dropout_transition=0[aout]",
                baseVolume,
                beepVolume,
                interval,
                activeSeconds
        );

        List<String> command = new ArrayList<>();
        command.add(ffmpegBinaryPath);
        command.add("-y");
        command.add("-i");
        command.add(originalFile.toString());
        command.add("-stream_loop");
        command.add("-1");
        command.add("-i");
        command.add(watermarkFile.toString());
        command.add("-filter_complex");
        command.add(filterComplex);
        command.add("-map");
        command.add("[aout]");
        command.add("-c:a");
        command.add("libmp3lame");
        command.add("-q:a");
        command.add("5");
        command.add(previewFile.toString());
        return command;
    }

    private String extractExtension(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return ".mp3";
        }
        int dot = fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) {
            return ".mp3";
        }
        return fileName.substring(dot).toLowerCase(Locale.ROOT);
    }

    private void cleanupFile(Path filePath) {
        if (filePath == null) {
            return;
        }
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
            // Keep cleanup failure non-fatal to preserve upload flow error context.
        }
    }

    private String abbreviate(String text) {
        if (text == null || text.isBlank()) {
            return "khong co output";
        }
        String normalized = text.trim().replaceAll("\\s+", " ");
        int maxLength = 500;
        return normalized.length() <= maxLength ? normalized : normalized.substring(0, maxLength) + "...";
    }
}


