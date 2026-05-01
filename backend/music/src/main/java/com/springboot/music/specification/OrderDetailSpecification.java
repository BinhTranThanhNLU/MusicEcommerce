package com.springboot.music.specification;

import com.springboot.music.entity.OrderDetail;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

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
}