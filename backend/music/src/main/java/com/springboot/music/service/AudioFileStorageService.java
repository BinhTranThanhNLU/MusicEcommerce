package com.springboot.music.service;

import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.BlobInfo;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class AudioFileStorageService {

    private static final Set<String> AUDIO_EXTENSIONS = Set.of(".mp3", ".wav", ".flac", ".m4a", ".aac", ".ogg");
    private static final Set<String> IMAGE_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp");

    private final ObjectProvider<Bucket> bucketProvider;

    public AudioFileStorageService(ObjectProvider<Bucket> bucketProvider) {
        this.bucketProvider = bucketProvider;
    }

    public String storeOriginalAudio(MultipartFile file) {
        return storeFile(file, "original_file_url", AUDIO_EXTENSIONS, "Audio file");
    }

    public String storeCoverImage(MultipartFile file) {
        return storeFile(file, "cover_image", IMAGE_EXTENSIONS, "Cover image");
    }

    public String storeWatermarkedPreview(Path previewFilePath) {
        if (previewFilePath == null || !Files.exists(previewFilePath)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File preview khong hop le");
        }

        try {
            byte[] previewBytes = Files.readAllBytes(previewFilePath);
            return storeBytes(previewBytes, ".mp3", "audio/mpeg", "watermarked_file_url", "Preview file");
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Khong the doc file preview de upload", ex);
        }
    }

    private String storeFile(MultipartFile file, String subDirectory, Set<String> allowedExtensions, String label) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, label + " khong duoc de trong") ;
        }

        String originalName = file.getOriginalFilename();
        String extension = extractExtension(originalName);
        if (!allowedExtensions.contains(extension)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, label + " khong hop le");
        }

        try {
            byte[] fileBytes = file.getBytes();
            String contentType = normalizeContentType(file.getContentType(), extension);
            return storeBytes(fileBytes, extension, contentType, subDirectory, label);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Khong the doc noi dung file " + label.toLowerCase(Locale.ROOT), ex);
        }
    }

    private String storeBytes(byte[] bytes,
                              String extension,
                              String contentType,
                              String subDirectory,
                              String label) {
        if (bytes == null || bytes.length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, label + " khong duoc de trong");
        }

        Bucket bucket = bucketProvider.getIfAvailable();
        if (bucket == null) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Firebase Storage chua duoc cau hinh. Hay bat app.firebase.enabled=true va cung cap credential.");
        }

        try {
            String storedFileName = UUID.randomUUID() + extension;
            String objectName = subDirectory + "/" + storedFileName;
            String downloadToken = UUID.randomUUID().toString();

            BlobInfo blobInfo = BlobInfo.newBuilder(bucket.getName(), objectName)
                    .setContentType(contentType)
                    .setMetadata(Map.of("firebaseStorageDownloadTokens", downloadToken))
                    .build();

            bucket.getStorage().create(blobInfo, bytes);
            return buildPublicUrl(bucket.getName(), objectName, downloadToken);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Khong the luu file " + label.toLowerCase(Locale.ROOT), ex);
        }
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return "";
        }

        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == originalFilename.length() - 1) {
            return "";
        }

        return originalFilename.substring(dotIndex).toLowerCase(Locale.ROOT);
    }

    private String normalizeContentType(String contentType, String extension) {
        if (contentType != null && !contentType.isBlank()) {
            return contentType;
        }

        return switch (extension) {
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".png" -> "image/png";
            case ".webp" -> "image/webp";
            case ".wav" -> "audio/wav";
            case ".flac" -> "audio/flac";
            case ".m4a" -> "audio/mp4";
            case ".aac" -> "audio/aac";
            case ".ogg" -> "audio/ogg";
            default -> "audio/mpeg";
        };
    }

    private String buildPublicUrl(String bucketName, String objectName, String downloadToken) {
        String encodedObjectName = URLEncoder.encode(objectName, StandardCharsets.UTF_8);
        return "https://firebasestorage.googleapis.com/v0/b/" + bucketName
                + "/o/" + encodedObjectName
                + "?alt=media&token=" + downloadToken;
    }
}

