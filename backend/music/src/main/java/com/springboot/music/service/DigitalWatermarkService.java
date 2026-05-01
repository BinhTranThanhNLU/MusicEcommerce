package com.springboot.music.service;

import com.mpatric.mp3agic.ID3v2;
import com.mpatric.mp3agic.ID3v24Tag;
import com.mpatric.mp3agic.Mp3File;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class DigitalWatermarkService {

    public byte[] injectWatermark(String fileUrl, String watermarkId, String buyerEmail) {
        Path tempOriginal = null;
        Path tempWatermarked = null;

        try {
            // 1. Tạo 2 file tạm trong hệ thống
            tempOriginal = Files.createTempFile("original-", ".mp3");
            tempWatermarked = Files.createTempFile("watermarked-", ".mp3");

            // 2. Tải file từ Firebase Storage về file tạm
            try (InputStream in = new URL(fileUrl).openStream()) {
                Files.copy(in, tempOriginal, StandardCopyOption.REPLACE_EXISTING);
            }

            // 3. Sử dụng mp3agic để đọc file
            Mp3File mp3file = new Mp3File(tempOriginal.toFile());
            ID3v2 id3v2Tag;

            // Nếu file đã có thẻ ID3v2 thì lấy ra, chưa có thì tạo mới
            if (mp3file.hasId3v2Tag()) {
                id3v2Tag = mp3file.getId3v2Tag();
            } else {
                id3v2Tag = new ID3v24Tag();
                mp3file.setId3v2Tag(id3v2Tag);
            }

            // 4. BẮT ĐẦU NHÚNG MÃ ĐỊNH DANH BẢN QUYỀN
            String watermarkData = "License: " + watermarkId + " | Buyer: " + buyerEmail;
            id3v2Tag.setCopyright(watermarkData);
            id3v2Tag.setPublisher("Music Commerce System");
            id3v2Tag.setComment(watermarkData);

            // 5. Lưu lại thành file MP3 mới
            mp3file.save(tempWatermarked.toAbsolutePath().toString());

            // 6. Đọc thành mảng byte để gửi thẳng về cho Frontend tải xuống
            return Files.readAllBytes(tempWatermarked);

        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Loi khi nhung Watermark vao file nhac: " + ex.getMessage());
        } finally {
            // 7. Luôn nhớ xóa file tạm để tránh rác server
            cleanupTempFile(tempOriginal);
            cleanupTempFile(tempWatermarked);
        }
    }

    private void cleanupTempFile(Path filePath) {
        if (filePath != null) {
            try { Files.deleteIfExists(filePath); } catch (Exception ignored) {}
        }
    }
}