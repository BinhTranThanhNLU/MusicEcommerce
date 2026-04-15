package com.springboot.music.specification;

import com.springboot.music.entity.*;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AudioTrackSpecification {

    // Một hàm filter duy nhất cân hết mọi trường hợp
    public static Specification<AudioTrack> filter(
            Integer genreId, Integer moodId, Integer themeId,
            Double minPrice, Double maxPrice,
            List<String> types, List<Integer> artistIds) {

        return (Root<AudioTrack> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Xử lý loại bỏ duplicate do dùng JOIN nhiều bảng
            query.distinct(true);

            // 1. Lọc theo Genre (nếu có truyền vào)
            if (genreId != null) {
                Join<AudioTrack, Genre> genreJoin = root.join("genres", JoinType.INNER);
                predicates.add(cb.equal(genreJoin.get("id"), genreId));
            }

            // 2. Lọc theo Mood (nếu có truyền vào)
            if (moodId != null) {
                Join<AudioTrack, Mood> moodJoin = root.join("moods", JoinType.INNER);
                predicates.add(cb.equal(moodJoin.get("id"), moodId));
            }

            // 3. Lọc theo Theme (nếu có truyền vào)
            if (themeId != null) {
                Join<AudioTrack, Theme> themeJoin = root.join("themes", JoinType.INNER);
                predicates.add(cb.equal(themeJoin.get("id"), themeId));
            }

            // 4. Lọc theo Khoảng Giá (Ví dụ: từ 50000 VND đến 200000 VND)
            if (minPrice != null || maxPrice != null) {
                Join<AudioTrack, AudioTrackLicense> licenseJoin = root.join("licenses", JoinType.LEFT);
                if (minPrice != null) {
                    predicates.add(cb.greaterThanOrEqualTo(licenseJoin.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    predicates.add(cb.lessThanOrEqualTo(licenseJoin.get("price"), maxPrice));
                }
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

            // Kết hợp tất cả điều kiện bằng toán tử AND
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}