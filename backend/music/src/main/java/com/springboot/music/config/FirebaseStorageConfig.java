package com.springboot.music.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StringUtils;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
@ConditionalOnProperty(prefix = "app.firebase", name = "enabled", havingValue = "true")
public class FirebaseStorageConfig {

    @Value("${app.firebase.credentials-path}")
    private String credentialsPath;

    @Value("${app.firebase.bucket-name}")
    private String bucketName;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!StringUtils.hasText(credentialsPath)) {
            throw new IllegalStateException("app.firebase.credentials-path khong duoc de trong khi app.firebase.enabled=true");
        }
        if (!StringUtils.hasText(bucketName)) {
            throw new IllegalStateException("app.firebase.bucket-name khong duoc de trong khi app.firebase.enabled=true");
        }

        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        try (InputStream credentialsStream = openCredentialsStream(credentialsPath)) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(credentialsStream))
                    .setStorageBucket(bucketName)
                    .build();
            return FirebaseApp.initializeApp(options);
        }
    }

    @Bean
    public Bucket firebaseBucket(FirebaseApp firebaseApp) {
        return StorageClient.getInstance(firebaseApp).bucket(bucketName);
    }

    private InputStream openCredentialsStream(String path) throws IOException {
        String normalized = path.trim();
        if (normalized.startsWith("classpath:")) {
            String resourcePath = normalized.substring("classpath:".length());
            return new ClassPathResource(resourcePath).getInputStream();
        }

        return new FileInputStream(normalized);
    }
}
