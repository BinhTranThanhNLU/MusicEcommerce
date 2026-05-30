package com.springboot.music.service;

import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@Service
public class MelodySearchService {

    private final String API_URL = "http://localhost:5000/api/extract-audio";
    private final RestTemplate restTemplate = new RestTemplate();

    public List<Double> extractMelodyVector(MultipartFile file) {
        String extractApiUrl = API_URL;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        try {
            // Chuyển MultipartFile thành Resource để RestTemplate có thể gửi đi như một file
            ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            body.add("audio", fileAsResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Gọi sang Python
            ResponseEntity<Map> response = restTemplate.postForEntity(extractApiUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                // Lấy field "vector" từ JSON trả về của Python
                return (List<Double>) responseBody.get("vector");
            }
        } catch (Exception e) {
            System.err.println("Lỗi kết nối AI Python (Extract Audio): " + e.getMessage());
        }
        return null;
    }

}
