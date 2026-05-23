package com.springboot.music.service;

import com.springboot.music.document.AudioTrackDocument;
import com.springboot.music.repository.AudioTrackSearchRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.core.query.StringQuery;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AudioTrackSearchService {

    private final AudioTrackSearchRepository audioTrackSearchRepository;
    private final ElasticsearchOperations elasticsearchOperations;
    private final SemanticSearchService semanticSearchService;

    public AudioTrackSearchService(AudioTrackSearchRepository audioTrackSearchRepository,
                                   ElasticsearchOperations elasticsearchOperations,
                                   SemanticSearchService semanticSearchService) {
        this.audioTrackSearchRepository = audioTrackSearchRepository;
        this.elasticsearchOperations = elasticsearchOperations;
        this.semanticSearchService = semanticSearchService;
    }

    public SearchHits<AudioTrackDocument> fullTextSearch(String keyword, int page, int size) {
//        if (keyword == null || keyword.trim().isEmpty()) {
//            return SearchHits.empty();
//        }

        String cleanKeyword = keyword.trim();
        Pageable pageable = PageRequest.of(page, size);

        // Multi-field full-text search query
        String queryJson = """
                {
                    "bool": {
                        "should": [
                            {
                                "match": {
                                    "title": {
                                        "query": "%s",
                                        "boost": 3,
                                        "analyzer": "vietnamese"
                                    }
                                }
                            },
                            {
                                "match": {
                                    "artistName": {
                                        "query": "%s",
                                        "boost": 2,
                                        "analyzer": "vietnamese"
                                    }
                                }
                            },
                            {
                                "match": {
                                    "description": {
                                        "query": "%s",
                                        "boost": 1,
                                        "analyzer": "vietnamese"
                                    }
                                }
                            },
                            {
                                "match": {
                                    "lyrics": {
                                        "query": "%s",
                                        "boost": 1,
                                        "analyzer": "vietnamese"
                                    }
                                }
                            }
                        ]
                    }
                }
                """.formatted(cleanKeyword, cleanKeyword, cleanKeyword, cleanKeyword);

        Query query = new StringQuery(queryJson);
        query.setPageable(pageable);

        SearchHits<AudioTrackDocument> searchHits = elasticsearchOperations.search(query, AudioTrackDocument.class);
        return elasticsearchOperations.search(query, AudioTrackDocument.class);
    }

    public SearchHits<AudioTrackDocument> fuzzySearch(String keyword, int page, int size) {
//        if (keyword == null || keyword.trim().isEmpty()) {
//            return SearchHits.empty();
//        }

        String cleanKeyword = keyword.trim();
        Pageable pageable = PageRequest.of(page, size);

        // Multi-field fuzzy search query
        String queryJson = """
                {
                    "bool": {
                        "should": [
                            {
                                "match": {
                                    "title": {
                                        "query": "%s",
                                        "fuzziness": "AUTO",
                                        "boost": 3
                                    }
                                }
                            },
                            {
                                "match": {
                                    "artistName": {
                                        "query": "%s",
                                        "fuzziness": "AUTO",
                                        "boost": 2
                                    }
                                }
                            },
                            {
                                "match": {
                                    "description": {
                                        "query": "%s",
                                        "fuzziness": "AUTO",
                                        "boost": 1
                                    }
                                }
                            }
                        ]
                    }
                }
                """.formatted(cleanKeyword, cleanKeyword, cleanKeyword);

        Query query = new StringQuery(queryJson);
        query.setPageable(pageable);

        SearchHits<AudioTrackDocument> searchHits = elasticsearchOperations.search(query, AudioTrackDocument.class);
        return elasticsearchOperations.search(query, AudioTrackDocument.class);
    }

    /**
     * Advanced Search: Kết hợp điều kiện lọc theo status, genre, mood, theme
     */
    public SearchHits<AudioTrackDocument> advancedSearch(
            String keyword,
            String status,
            List<String> genres,
            List<String> moods,
            List<String> themes,
            Double minPrice,
            Double maxPrice,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        StringBuilder queryJson = new StringBuilder();

        queryJson.append("""
        {
          "bool": {
            "must": [
        """);

        // Keyword search
        if (keyword != null && !keyword.trim().isEmpty()) {

            String cleanKeyword = keyword.trim();

            queryJson.append("""
            {
              "multi_match": {
                "query": "%s",
                "fields": [
                  "title^3",
                  "artistName^2",
                  "description",
                  "lyrics"
                ],
                "type": "best_fields",
                "analyzer": "vietnamese"
              }
            }
            """.formatted(cleanKeyword));

        } else {

            queryJson.append("""
            {
              "match_all": {}
            }
            """);
        }

        queryJson.append("""
            ],
            "filter": [
        """);

        boolean hasFilter = false;

        // Status filter
        if (status != null && !status.trim().isEmpty()) {

            queryJson.append("""
            {
              "term": {
                "status.keyword": "%s"
              }
            }
            """.formatted(status));

            hasFilter = true;
        }

        // Genres filter
        if (genres != null && !genres.isEmpty()) {

            if (hasFilter) {
                queryJson.append(",");
            }

            String genresJson = genres.stream()
                    .map(g -> "\"" + g + "\"")
                    .collect(Collectors.joining(", "));

            queryJson.append("""
            {
              "terms": {
                "genres.keyword": [%s]
              }
            }
            """.formatted(genresJson));

            hasFilter = true;
        }

        // Moods filter
        if (moods != null && !moods.isEmpty()) {

            if (hasFilter) {
                queryJson.append(",");
            }

            String moodsJson = moods.stream()
                    .map(m -> "\"" + m + "\"")
                    .collect(Collectors.joining(", "));

            queryJson.append("""
            {
              "terms": {
                "moods.keyword": [%s]
              }
            }
            """.formatted(moodsJson));

            hasFilter = true;
        }

        // Themes filter
        if (themes != null && !themes.isEmpty()) {

            if (hasFilter) {
                queryJson.append(",");
            }

            String themesJson = themes.stream()
                    .map(t -> "\"" + t + "\"")
                    .collect(Collectors.joining(", "));

            queryJson.append("""
            {
              "terms": {
                "themes.keyword": [%s]
              }
            }
            """.formatted(themesJson));

            hasFilter = true;
        }

        // Price range filter
        if (minPrice != null || maxPrice != null) {

            if (hasFilter) {
                queryJson.append(",");
            }

            List<String> priceConditions = new ArrayList<>();

            if (minPrice != null) {
                priceConditions.add("\"gte\": " + minPrice);
            }

            if (maxPrice != null) {
                priceConditions.add("\"lte\": " + maxPrice);
            }

            String rangeJson = String.join(", ", priceConditions);

            queryJson.append("""
            {
              "range": {
                "pricesVnd": {
                  %s
                }
              }
            }
            """.formatted(rangeJson));
        }

        // Đóng JSON
        queryJson.append("""
            ]
          }
        }
        """);

        Query query = new StringQuery(queryJson.toString());
        query.setPageable(pageable);

        return elasticsearchOperations.search(
                query,
                AudioTrackDocument.class
        );
    }

    public SearchHits<AudioTrackDocument> phraseSearch(String phrase, int page, int size) {
//        if (phrase == null || phrase.trim().isEmpty()) {
//            return List.of();
//        }

        String cleanPhrase = phrase.trim();
        Pageable pageable = PageRequest.of(page, size);

        // Phrase search query
        String queryJson = """
                {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "title": {
                                        "query": "%s",
                                        "boost": 3
                                    }
                                }
                            },
                            {
                                "match_phrase": {
                                    "description": {
                                        "query": "%s",
                                        "boost": 1
                                    }
                                }
                            },
                            {
                                "match_phrase": {
                                    "lyrics": {
                                        "query": "%s",
                                        "boost": 1
                                    }
                                }
                            }
                        ]
                    }
                }
                """.formatted(cleanPhrase, cleanPhrase, cleanPhrase);

        Query query = new StringQuery(queryJson);
        query.setPageable(pageable);

        SearchHits<AudioTrackDocument> searchHits = elasticsearchOperations.search(query, AudioTrackDocument.class);
        return elasticsearchOperations.search(query, AudioTrackDocument.class);
    }

    public SearchHits<AudioTrackDocument> filterByMultipleCriteria(String status,
                                                            List<String> genres, List<String> moods, List<String> themes,
                                                            Double minPrice, Double maxPrice,
                                                            int page, int size) {
        return advancedSearch(null, status, genres, moods, themes, minPrice, maxPrice, page, size);
    }

    public SearchHits<AudioTrackDocument> autocomplete(String prefix, int limit) {
//        if (prefix == null || prefix.trim().isEmpty()) {
//            return List.of();
//        }

        String cleanPrefix = prefix.trim();
        Pageable pageable = PageRequest.of(0, limit);

        // Prefix search query
        String queryJson = """
                {
                    "bool": {
                        "should": [
                            {
                                "match_phrase_prefix": {
                                    "title": {
                                        "query": "%s",
                                        "boost": 3
                                    }
                                }
                            },
                            {
                                "match_phrase_prefix": {
                                    "artistName": {
                                        "query": "%s",
                                        "boost": 2
                                    }
                                }
                            }
                        ]
                    }
                }
                """.formatted(cleanPrefix, cleanPrefix);

        Query query = new StringQuery(queryJson);
        query.setPageable(pageable);

        SearchHits<AudioTrackDocument> searchHits = elasticsearchOperations.search(query, AudioTrackDocument.class);
        return elasticsearchOperations.search(query, AudioTrackDocument.class);
    }

    public SearchHits<AudioTrackDocument> semanticSearch(String keyword, int size) {
//        if (keyword == null || keyword.trim().isEmpty()) {
//            return SearchHits.empty();
//        }

        // 1. Dịch câu tìm kiếm của khách hàng (VD: "nhạc nghe lúc mưa") thành Vector
        List<Double> queryVector = semanticSearchService.getEmbedding(keyword);

        if (queryVector == null || queryVector.size() != 768) {
            throw new RuntimeException("Không thể tạo vector cho từ khóa");
        }

        // 2. Ép mảng List<Double> thành chuỗi JSON dạng [0.1, 0.2, ...]
        String vectorJson = queryVector.toString();

        // 3. Viết query KNN tìm kiếm các vector gần nhất
        String queryJson = """
            {
              "knn": {
                "field": "embeddingVector",
                "query_vector": %s,
                "k": %d,
                "num_candidates": 100
              }
            }
            """.formatted(vectorJson, size);

        Query query = new StringQuery(queryJson);

        return elasticsearchOperations.search(query, AudioTrackDocument.class);
    }

    public SearchHits<AudioTrackDocument> hybridSearch(String keyword, int page, int size) {
        String cleanKeyword = keyword.trim();
        Pageable pageable = PageRequest.of(page, size);

        // 1. Dịch từ khóa gõ thành Vector
        List<Double> queryVector = semanticSearchService.getEmbedding(cleanKeyword);

        // Fallback an toàn: Nếu server AI Python sập hoặc lỗi, tự động lùi về Full-text search (BM25)
        if (queryVector == null || queryVector.size() != 768) {
            return fullTextSearch(cleanKeyword, page, size);
        }

        String vectorJson = queryVector.toString();

        // 2. Kết hợp BM25 (Full-text) và Vector (Semantic)
        // Dùng bool -> should. Bất kỳ bài hát nào thỏa mãn 1 trong 2 điều kiện sẽ được lấy ra.
        // Nếu thỏa mãn CẢ 2, điểm sẽ được cộng dồn (nhấn mạnh Exact Match nhờ boost cao hơn).
        String queryJson = """
        {
          "bool": {
            "should": [
              {
                "multi_match": {
                  "query": "%s",
                  "fields": [
                    "title^5", 
                    "artistName^3", 
                    "description", 
                    "lyrics"
                  ],
                  "type": "best_fields",
                  "analyzer": "vietnamese",
                  "boost": 2.0,
                  "fuzziness": "AUTO"
                }
              },
              {
                "knn": {
                  "field": "embeddingVector",
                  "query_vector": %s,
                  "num_candidates": 100,
                  "boost": 1.0
                }
              }
            ],
            "minimum_should_match": 1
          }
        }
        """.formatted(cleanKeyword, vectorJson);

        Query query = new StringQuery(queryJson);
        query.setPageable(pageable);

        return elasticsearchOperations.search(query, AudioTrackDocument.class);
    }
}

