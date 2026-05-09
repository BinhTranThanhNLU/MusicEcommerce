package com.springboot.music.specification;

import com.springboot.music.entity.*;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AudioTrackSpecification {


    public static Specification<AudioTrack> filter(
            Integer genreId, Integer moodId, Integer themeId,
            Double minPrice, Double maxPrice,
            List<String> types, List<Integer> artistIds,
            String sort, List<String> statuses) {

        return (Root<AudioTrack> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Xử lý loại bỏ duplicate do dùng JOIN nhiều bảng
            query.distinct(true);

            List<String> normalizedStatuses = normalizeStatuses(statuses);
            if (normalizedStatuses.isEmpty()) {
                // Mặc định public chỉ lấy track đã được duyệt
                predicates.add(cb.equal(cb.upper(root.get("status")), "APPROVED"));
            } else {
                predicates.add(cb.upper(root.get("status")).in(normalizedStatuses));
            }

            // 1. Lọc theo Genre
            if (genreId != null) {
                Join<AudioTrack, Genre> genreJoin = root.join("genres", JoinType.INNER);
                predicates.add(cb.equal(genreJoin.get("id"), genreId));
            }

            // 2. Lọc theo Mood
            if (moodId != null) {
                Join<AudioTrack, Mood> moodJoin = root.join("moods", JoinType.INNER);
                predicates.add(cb.equal(moodJoin.get("id"), moodId));
            }

            // 3. Lọc theo Theme
            if (themeId != null) {
                Join<AudioTrack, Theme> themeJoin = root.join("themes", JoinType.INNER);
                predicates.add(cb.equal(themeJoin.get("id"), themeId));
            }

            // --- TỐI ƯU JOIN BẢNG LICENSE ---
            Join<AudioTrack, AudioTrackLicense> licenseJoin = null;
            boolean needsLicenseJoin = minPrice != null || maxPrice != null ||
                    "price-asc".equals(sort) || "price-desc".equals(sort);
            if (needsLicenseJoin) {
                licenseJoin = root.join("licenses", JoinType.LEFT);
            }

            // 4. Lọc theo Khoảng Giá
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(licenseJoin.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(licenseJoin.get("price"), maxPrice));
            }

            // 5. Lọc theo Audio Type
            if (types != null && !types.isEmpty()) {
                predicates.add(root.get("audioType").in(types));
            }

            // 6. Lọc theo Artist
            if (artistIds != null && !artistIds.isEmpty()) {
                Join<AudioTrack, User> artistJoin = root.join("artist", JoinType.LEFT);
                predicates.add(artistJoin.get("id").in(artistIds));
            }

            // --- XỬ LÝ SORT (SẮP XẾP) --
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                if ("popular".equals(sort)) {
                    query.orderBy(cb.desc(root.get("playCount")));
                } else if ("price-asc".equals(sort)) {
                    query.orderBy(cb.asc(licenseJoin.get("price")));
                } else if ("price-desc".equals(sort)) {
                    query.orderBy(cb.desc(licenseJoin.get("price")));
                } else {
                    // Mặc định hoặc "newest": Sắp xếp mới nhất
                    query.orderBy(cb.desc(root.get("uploadDate")));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<AudioTrack> filterForArtist(
            Integer artistId,
            String keyword,
            String genreName,
            Double minPrice,
            Double maxPrice,
            List<String> types,
            String sort,
            String status) {

        return (Root<AudioTrack> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            query.distinct(true);

            if (artistId != null) {
                Join<AudioTrack, User> artistJoin = root.join("artist", JoinType.LEFT);
                predicates.add(cb.equal(artistJoin.get("id"), artistId));
            }

            // --- XỬ LÝ TÌM KIẾM THEO TÊN (KEYWORD) ---
            if (keyword != null && !keyword.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + keyword.trim().toLowerCase() + "%"));
            }

            // --- XỬ LÝ LỌC THEO THỂ LOẠI (GENRE) ---
            if (genreName != null && !genreName.trim().isEmpty() && !"all".equalsIgnoreCase(genreName)) {
                Join<AudioTrack, Genre> genreJoin = root.join("genres", JoinType.INNER);
                // Giả định entity Genre của bạn có thuộc tính "name"
                predicates.add(cb.equal(cb.lower(genreJoin.get("name")), genreName.toLowerCase()));
            }

            // --- XỬ LÝ TRẠNG THÁI ---
            String normalizedStatus = normalizeStatusFilter(status);
            if (normalizedStatus != null) {
                predicates.add(cb.equal(cb.upper(root.get("status")), normalizedStatus));
            }

            // ... (Phần License, Price, Type, Sort giữ nguyên như cũ của bạn) ...

            Join<AudioTrack, AudioTrackLicense> licenseJoin = null;
            boolean needsLicenseJoin = minPrice != null || maxPrice != null
                    || "price-asc".equals(sort) || "price-desc".equals(sort);
            if (needsLicenseJoin) {
                licenseJoin = root.join("licenses", JoinType.LEFT);
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(licenseJoin.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(licenseJoin.get("price"), maxPrice));
            }

            if (types != null && !types.isEmpty()) {
                predicates.add(root.get("audioType").in(types));
            }

            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                if ("popular".equals(sort)) {
                    query.orderBy(cb.desc(root.get("playCount")));
                } else if ("price-asc".equals(sort)) {
                    query.orderBy(cb.asc(licenseJoin.get("price")));
                } else if ("price-desc".equals(sort)) {
                    query.orderBy(cb.desc(licenseJoin.get("price")));
                } else {
                    query.orderBy(cb.desc(root.get("uploadDate")));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static String normalizeStatusFilter(String status) {
        if (status == null) {
            return null;
        }

        String value = status.trim().replace('_', ' ').replace('-', ' ');
        if (value.isBlank() || "all".equalsIgnoreCase(value)) {
            return null;
        }

        return value.toUpperCase();
    }

    private static List<String> normalizeStatuses(List<String> statuses) {
        if (statuses == null || statuses.isEmpty()) {
            return List.of();
        }

        List<String> normalized = new ArrayList<>();
        for (String status : statuses) {
            String value = normalizeStatusFilter(status);
            if (value != null) {
                normalized.add(value);
            }
        }
        return normalized;
    }
}