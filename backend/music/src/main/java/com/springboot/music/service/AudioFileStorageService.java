package com.springboot.music.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
public class AudioFileStorageService {

    private static final Set<String> AUDIO_EXTENSIONS = Set.of(".mp3", ".wav", ".flac", ".m4a", ".aac", ".ogg");
    private static final Set<String> IMAGE_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp");

    private final Cloudinary cloudinary;

    public AudioFileStorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
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

    /**
     * Kept method name for backward compatibility with existing callers.
     * This will attempt to extract Cloudinary public_id from the public URL and delete the resource.
     */
    public void deleteFileFromFirebase(String publicUrl) {
        if (publicUrl == null || publicUrl.isBlank()) {
            return;
        }

        try {
            String publicId = extractPublicIdFromCloudinaryUrl(publicUrl);
            if (publicId == null || publicId.isBlank()) return;

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception ex) {
            // Non-fatal: log and continue
            System.err.println("Cảnh báo: Không thể xóa file khỏi Cloudinary: " + ex.getMessage());
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

        try {
            Map uploadParams = ObjectUtils.asMap(
                    "folder", subDirectory,
                    "resource_type", "auto",
                    "use_filename", false,
                    "unique_filename", true
            );

            @SuppressWarnings("unchecked")
            Map result = cloudinary.uploader().upload(bytes, uploadParams);
            // secure_url is preferred
            Object secureUrl = result.get("secure_url");
            if (secureUrl != null) return secureUrl.toString();

            // fallback to url
            Object url = result.get("url");
            if (url != null) return url.toString();

            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Khong the luu file " + label.toLowerCase(Locale.ROOT));
        } catch (ResponseStatusException ex) {
            throw ex;
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

    /**
     * Try to extract Cloudinary public_id from a known Cloudinary URL.
     * Supports URLs that include a version segment like /v123456/.
     * Example: https://res.cloudinary.com/demo/raw/upload/v1610000000/folder/name.mp3 -> folder/name
     */
    private String extractPublicIdFromCloudinaryUrl(String publicUrl) {
        if (publicUrl == null || publicUrl.isBlank()) return null;
        try {
            // find "/upload/" marker
            int idx = publicUrl.indexOf("/upload/");
            if (idx < 0) return null;
            String after = publicUrl.substring(idx + "/upload/".length());
            // remove possible version prefix v123456/
            after = after.replaceFirst("^v\\d+\\/", "");
            // remove query string if any
            int q = after.indexOf('?');
            if (q >= 0) after = after.substring(0, q);
            // remove extension
            int lastDot = after.lastIndexOf('.');
            if (lastDot >= 0) after = after.substring(0, lastDot);
            // trailing slashes cleanup
            if (after.startsWith("/")) after = after.substring(1);
            return after;
        } catch (Exception ex) {
            return null;
        }
    }
}
