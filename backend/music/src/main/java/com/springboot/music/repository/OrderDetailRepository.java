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

    // Tính TỔNG DOANH THU trọn đời của Nghệ sĩ
    @Query("""
            SELECT SUM(od.price) 
            FROM OrderDetail od 
            WHERE od.audioTrack.artist.id = :artistId 
              AND od.order.paymentStatus = 'COMPLETED'
            """)
    Double sumTotalRevenueByArtistId(@Param("artistId") Integer artistId);

    // Gom nhóm doanh thu theo TỪNG LOẠI GIẤY PHÉP (Cho biểu đồ tròn)
    @Query("""
            SELECT od.license.licenseType, SUM(od.price) 
            FROM OrderDetail od 
            WHERE od.audioTrack.artist.id = :artistId 
              AND od.order.paymentStatus = 'COMPLETED'
            GROUP BY od.license.licenseType
            """)
    List<Object[]> sumRevenueByLicenseType(@Param("artistId") Integer artistId);

    // Lấy Top bài hát mang lại nhiều tiền nhất (Dùng Pageable để lấy Top 5)
    @Query("""
            SELECT at.id, at.title, at.coverImage, at.audioType, COUNT(od), SUM(od.price) as total_revenue
            FROM OrderDetail od
            JOIN od.audioTrack at
            WHERE at.artist.id = :artistId 
              AND od.order.paymentStatus = 'COMPLETED'
            GROUP BY at.id, at.title, at.coverImage, at.audioType
            ORDER BY SUM(od.price) DESC
            """)
    List<Object[]> findTopPerformingTracksByArtistId(@Param("artistId") Integer artistId, Pageable pageable);

    // Lấy tất cả OrderDetail đã bán của Nghệ sĩ
    @Query("""
            SELECT od
            FROM OrderDetail od
            JOIN FETCH od.order o
            WHERE od.audioTrack.artist.id = :artistId
              AND o.paymentStatus = 'COMPLETED'
            """)
    List<OrderDetail> findAllCompletedByArtistId(@Param("artistId") Integer artistId);

    // Lấy lịch sử giao dịch (bán nhạc) có phân trang
    @Query(value = """
            SELECT od
            FROM OrderDetail od
            JOIN FETCH od.order o
            JOIN FETCH od.audioTrack at
            JOIN FETCH od.license l
            WHERE at.artist.id = :artistId
              AND o.paymentStatus = 'COMPLETED'
            """,
            countQuery = """
            SELECT COUNT(od)
            FROM OrderDetail od
            WHERE od.audioTrack.artist.id = :artistId
              AND od.order.paymentStatus = 'COMPLETED'
            """)
    Page<OrderDetail> findTransactionsByArtistId(@Param("artistId") Integer artistId, Pageable pageable);

    // Tính doanh thu tháng hiện tại
    @Query("""
            SELECT SUM(od.price) 
            FROM OrderDetail od 
            WHERE od.audioTrack.artist.id = :artistId 
              AND od.order.paymentStatus = 'COMPLETED'
              AND MONTH(od.order.createdAt) = MONTH(CURRENT_DATE)
              AND YEAR(od.order.createdAt) = YEAR(CURRENT_DATE)
            """)
    Double sumMonthlyRevenueByArtistId(@Param("artistId") Integer artistId);

    // Đếm số lượng khách hàng độc lập
    @Query("""
            SELECT COUNT(DISTINCT od.order.user.id) 
            FROM OrderDetail od 
            WHERE od.audioTrack.artist.id = :artistId 
              AND od.order.paymentStatus = 'COMPLETED'
            """)
    Long countDistinctCustomersByArtistId(@Param("artistId") Integer artistId);

    // Lấy 5 đơn hàng mới nhất
    @Query("""
            SELECT od 
            FROM OrderDetail od 
            JOIN FETCH od.order o 
            JOIN FETCH od.audioTrack at 
            JOIN FETCH o.user u
            WHERE at.artist.id = :artistId 
              AND o.paymentStatus = 'COMPLETED'
            ORDER BY o.createdAt DESC
            """)
    List<OrderDetail> findRecentOrdersByArtistId(@Param("artistId") Integer artistId, Pageable pageable);

    @Query("""
            SELECT COALESCE(SUM(od.adminFee), 0)
            FROM OrderDetail od
            WHERE od.order.paymentStatus = 'COMPLETED'
            """)
    Double sumTotalAdminRevenue();

    @Query(value = """
            SELECT
                CASE
                    WHEN :period = 'day' THEN DATE_FORMAT(o.created_at, '%Y-%m-%d')
                    WHEN :period = 'year' THEN DATE_FORMAT(o.created_at, '%Y')
                    ELSE DATE_FORMAT(o.created_at, '%Y-%m')
                END AS bucket,
                COALESCE(SUM(od.admin_fee), 0) AS revenue
            FROM order_detail od
            JOIN `order` o ON o.order_id = od.order_id
            WHERE o.payment_status = 'COMPLETED'
              AND o.created_at >= :startAt
            GROUP BY bucket
            ORDER BY bucket
            """, nativeQuery = true)
    List<Object[]> sumAdminRevenueByPeriod(@Param("period") String period,
                                           @Param("startAt") java.time.LocalDateTime startAt);
}
