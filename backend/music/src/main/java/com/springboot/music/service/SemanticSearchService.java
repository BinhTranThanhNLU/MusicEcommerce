package com.springboot.music.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SemanticSearchService {

    private final String API_URL = "http://localhost:5000/api/embed";
    private final RestTemplate restTemplate = new RestTemplate();

    public List<Double> getEmbedding(String text) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("inputs", text);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            Double[] response = restTemplate.postForObject(API_URL, entity, Double[].class);
            if (response != null) {
                return Arrays.asList(response);
            }
        } catch (Exception e) {
            System.err.println("Lỗi kết nối AI Python Local: " + e.getMessage());
        }

        return null;
    }
}