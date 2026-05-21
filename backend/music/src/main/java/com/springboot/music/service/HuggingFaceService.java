package com.springboot.music.service;

import org.springframework.beans.factory.annotation.Value;
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
public class HuggingFaceService {

    @Value("${huggingface.api.key}")
    private String apiKey;

    //private final String API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/bkai-foundation-models/vietnamese-bi-encoder";

    //private final String API_URL = "https://api-inference.huggingface.co/models/bkai-foundation-models/vietnamese-bi-encoder";

    private final String API_URL =
            "https://api-inference.huggingface.co/models/bkai-foundation-models/vietnamese-bi-encoder";

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Double> getEmbedding(String text) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, String> body = new HashMap<>();
        body.put("inputs", text);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            // API trả về một mảng các số thập phân (Double[])
            Double[] response = restTemplate.postForObject(API_URL, entity, Double[].class);
            if (response != null) {
                return Arrays.asList(response);
            }
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            // In ra thông báo lỗi chi tiết từ server
            System.err.println("API Error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("Lỗi kết nối AI: " + e.getMessage());
        }

        return null;
    }
}