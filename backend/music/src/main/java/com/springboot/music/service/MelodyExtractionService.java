package com.springboot.music.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Service
public class MelodyExtractionService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String PYTHON_API_URL = "http://localhost:5000/api/extract-audio";

    public List<Double> extractVectorFromUrl(String audioUrl) throws Exception {
        Path tempFile = null;
        try {
            // Bước 1: Tải file từ Cloudinary về thư mục tạm của hệ điều hành
            tempFile = Files.createTempFile("audio_sync_", ".mp3");
            try (InputStream in = new URL(audioUrl).openStream()) {
                Files.copy(in, tempFile, StandardCopyOption.REPLACE_EXISTING);
            }

            // Bước 2: Tạo request multipart/form-data gửi sang Python
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("audio", new FileSystemResource(tempFile.toFile()));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Bước 3: Gửi POST request tới cổng 5000
            ResponseEntity<String> response = restTemplate.postForEntity(PYTHON_API_URL, requestEntity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new RuntimeException("Python API trả về lỗi: " + response.getStatusCode());
            }

            // Bước 4: Parse chuỗi JSON trả về để lấy mảng 92 số (vector)
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            if (rootNode.has("error")) {
                throw new RuntimeException(rootNode.get("error").asText());
            }

            JsonNode vectorNode = rootNode.get("vector");
            List<Double> vector = new ArrayList<>();
            for (JsonNode node : vectorNode) {
                vector.add(node.asDouble());
            }

            return vector;

        } finally {
            // Đảm bảo luôn xóa file tạm dù thành công hay xảy ra lỗi
            if (tempFile != null) {
                Files.deleteIfExists(tempFile);
            }
        }
    }
}
