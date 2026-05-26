package com.springboot.music.specification;

import com.springboot.music.entity.OrderDetail;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class OrderDetailSpecification {

    public static Specification<OrderDetail> filterForArtist(
            Integer artistId, String search, String licenseType, String status) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. BẮT BUỘC: Giấy phép này phải thuộc bài hát do Artist này sở hữu và đơn hàng đã thanh toán
            predicates.add(cb.equal(root.join("audioTrack", JoinType.INNER).join("artist", JoinType.INNER).get("id"), artistId));
            predicates.add(cb.equal(root.join("order", JoinType.INNER).get("paymentStatus"), "COMPLETED"));

            // 2. Tìm kiếm (Theo Watermark ID hoặc Tên Khách Hàng)
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate matchWatermark = cb.like(cb.lower(root.get("watermarkId")), searchPattern);
                Predicate matchCustomer = cb.like(cb.lower(root.join("order", JoinType.INNER).join("user", JoinType.INNER).get("name")), searchPattern);
                predicates.add(cb.or(matchWatermark, matchCustomer));
            }

            // 3. Lọc theo Loại Giấy Phép (Khớp với value ở file React của bạn)
            if (licenseType != null && !licenseType.trim().isEmpty() && !"all".equalsIgnoreCase(licenseType)) {
                String typeValue = "";
                if ("personal".equalsIgnoreCase(licenseType)) typeValue = "Personal License";
                else if ("commercial".equalsIgnoreCase(licenseType)) typeValue = "Commercial License";
                else if ("exclusive".equalsIgnoreCase(licenseType)) typeValue = "Extended License";

                if (!typeValue.isEmpty()) {
                    predicates.add(cb.equal(root.join("license", JoinType.INNER).get("licenseType"), typeValue));
                }
            }

            // 4. Lọc theo Trạng Thái (ACTIVE, EXPIRED, REVOKED)
            if (status != null && !status.trim().isEmpty() && !"all".equalsIgnoreCase(status)) {
                String statusValue = status.toUpperCase();
                if ("DISPUTED".equals(statusValue)) {
                    statusValue = "REVOKED"; // Tạm map disputed thành revoked
                }
                predicates.add(cb.equal(root.get("licenseStatus"), statusValue));
            }

            // 5. Sắp xếp: Đơn hàng mới nhất lên đầu
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                query.orderBy(cb.desc(root.join("order", JoinType.INNER).get("createdAt")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<OrderDetail> filterForAdmin(
            String search, String licenseType, String status) {

        return (Root<OrderDetail> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            query.distinct(true);

            predicates.add(cb.equal(cb.upper(root.join("order", JoinType.INNER).get("paymentStatus")), "COMPLETED"));

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";

                Join<Object, Object> orderJoin = root.join("order", JoinType.INNER);
                Join<Object, Object> userJoin = orderJoin.join("user", JoinType.INNER);
                Join<Object, Object> audioJoin = root.join("audioTrack", JoinType.INNER);
                Join<Object, Object> artistJoin = audioJoin.join("artist", JoinType.LEFT);
                Join<Object, Object> licenseJoin = root.join("license", JoinType.LEFT);

                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("watermarkId")), searchPattern),
                        cb.like(cb.lower(userJoin.get("name")), searchPattern),
                        cb.like(cb.lower(userJoin.get("email")), searchPattern),
                        cb.like(cb.lower(audioJoin.get("title")), searchPattern),
                        cb.like(cb.lower(artistJoin.get("name")), searchPattern),
                        cb.like(cb.lower(licenseJoin.get("licenseType")), searchPattern)
                ));
            }

            if (licenseType != null && !licenseType.trim().isEmpty() && !"all".equalsIgnoreCase(licenseType)) {
                String typeValue = normalizeLicenseTypeFilter(licenseType);
                if (!typeValue.isEmpty()) {
                    predicates.add(cb.equal(root.join("license", JoinType.INNER).get("licenseType"), typeValue));
                }
            }

            if (status != null && !status.trim().isEmpty() && !"all".equalsIgnoreCase(status)) {
                String statusValue = status.trim().toUpperCase(Locale.ROOT);
                if ("DISPUTED".equals(statusValue)) {
                    statusValue = "REVOKED";
                }
                predicates.add(cb.equal(cb.upper(root.get("licenseStatus")), statusValue));
            }

            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                query.orderBy(cb.desc(root.join("order", JoinType.INNER).get("createdAt")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static String normalizeLicenseTypeFilter(String licenseType) {
        String value = licenseType.trim().toLowerCase(Locale.ROOT);
        if (value.contains("personal")) {
            return "Personal License";
        }
        if (value.contains("commercial")) {
            return "Commercial License";
        }
        if (value.contains("exclusive") || value.contains("extended")) {
            return "Extended License";
        }
        return licenseType.trim();
    }
}