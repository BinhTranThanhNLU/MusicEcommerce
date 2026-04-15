package com.springboot.music.specification;

import com.springboot.music.entity.*;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AudioTrackSpecification {

    // Thêm tham số String sort vào cuối
    public static Specification<AudioTrack> filter(
            Integer genreId, Integer moodId, Integer themeId,
            Double minPrice, Double maxPrice,
            List<String> types, List<Integer> artistIds,
            String sort) {

        return (Root<AudioTrack> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Xử lý loại bỏ duplicate do dùng JOIN nhiều bảng
            query.distinct(true);

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
}