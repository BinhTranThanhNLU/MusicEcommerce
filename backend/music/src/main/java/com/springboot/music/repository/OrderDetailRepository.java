package com.springboot.music.repository;

import com.springboot.music.entity.OrderDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer>, JpaSpecificationExecutor<OrderDetail> {
    @Query("SELECT od FROM OrderDetail od WHERE od.order.user.id = :userId AND od.order.paymentStatus = 'COMPLETED' ORDER BY od.order.createdAt DESC")
    List<OrderDetail> findByUserIdAndOrderCompleted(@Param("userId") Integer userId);

    @Query("""
            SELECT od
            FROM OrderDetail od
            JOIN FETCH od.order o
            JOIN FETCH od.audioTrack at
            JOIN FETCH od.license license
            WHERE od.id = :orderDetailId
              AND o.user.id = :userId
              AND o.paymentStatus = 'COMPLETED'
            """)
    Optional<OrderDetail> findDownloadItemForUser(@Param("orderDetailId") Integer orderDetailId,
                                                  @Param("userId") Integer userId);

    @Query("""
            SELECT od
            FROM OrderDetail od
            JOIN FETCH od.order o
            JOIN FETCH od.audioTrack at
            WHERE o.user.id = :userId
              AND at.id = :audioId
              AND o.paymentStatus = 'COMPLETED'
            """)
    Optional<OrderDetail> findCompletedPurchaseForUserAndAudio(@Param("userId") Integer userId,
                                                               @Param("audioId") Integer audioId);

    @Query("""
            SELECT CASE WHEN COUNT(od) > 0 THEN true ELSE false END
            FROM OrderDetail od
            WHERE od.order.user.id = :userId
              AND od.audioTrack.id = :audioId
              AND od.order.paymentStatus = 'COMPLETED'
            """)
    boolean existsCompletedPurchaseForUserAndAudio(@Param("userId") Integer userId,
                                                   @Param("audioId") Integer audioId);

    @Query("""
            SELECT od
            FROM OrderDetail od
            JOIN FETCH od.order o
            JOIN FETCH od.audioTrack at
            LEFT JOIN FETCH at.artist artist
            JOIN FETCH od.license license
            LEFT JOIN FETCH at.copyrightInfo copyrightInfo
            WHERE od.id = :orderDetailId
              AND o.user.id = :userId
              AND o.paymentStatus = 'COMPLETED'
            """)
    Optional<OrderDetail> findCertificateItemForUser(@Param("orderDetailId") Integer orderDetailId,
                                                     @Param("userId") Integer userId);

    // Lấy danh sách giấy phép (OrderDetail) mà bài hát do Artist (userId) sáng tác
    // Chỉ lấy những đơn hàng đã thanh toán thành công (COMPLETED)
    @Query("""
            SELECT od
            FROM OrderDetail od
            JOIN FETCH od.order o
            JOIN FETCH od.audioTrack at
            JOIN FETCH o.user customer
            JOIN FETCH od.license license
            WHERE at.artist.id = :artistId
              AND o.paymentStatus = 'COMPLETED'
            ORDER BY o.createdAt DESC
            """)
    Page<OrderDetail> findLicensesByArtistId(@Param("artistId") Integer artistId, Pageable pageable);

    // Đếm tổng số giấy phép đã bán
    @Query("""
            SELECT COUNT(od) 
            FROM OrderDetail od 
            WHERE od.audioTrack.artist.id = :artistId 
              AND od.order.paymentStatus = 'COMPLETED'
            """)
    long countTotalLicensesByArtistId(@Param("artistId") Integer artistId);

    // Đếm riêng giấy phép Thương mại (Commercial) và Độc quyền (Extended)
    @Query("""
            SELECT COUNT(od) 
            FROM OrderDetail od 
            WHERE od.audioTrack.artist.id = :artistId 
              AND od.order.paymentStatus = 'COMPLETED' 
              AND od.license.licenseType IN ('Commercial License', 'Extended License')
            """)
    long countCommercialLicensesByArtistId(@Param("artistId") Integer artistId);

    @Query("""
            SELECT od
            FROM OrderDetail od
            JOIN FETCH od.order o
            JOIN FETCH od.audioTrack at
            LEFT JOIN FETCH at.artist artist
            JOIN FETCH od.license license
            LEFT JOIN FETCH at.copyrightInfo copyrightInfo
            WHERE od.id = :orderDetailId
              AND at.artist.id = :artistId
              AND o.paymentStatus = 'COMPLETED'
            """)
    Optional<OrderDetail> findCertificateItemForArtist(@Param("orderDetailId") Integer orderDetailId,
                                                       @Param("artistId") Integer artistId);
}
