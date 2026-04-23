package com.springboot.music.repository;

import com.springboot.music.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
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
            LEFT JOIN FETCH at.artist artist
            JOIN FETCH od.license license
            LEFT JOIN FETCH at.copyrightInfo copyrightInfo
            WHERE od.id = :orderDetailId
              AND o.user.id = :userId
              AND o.paymentStatus = 'COMPLETED'
            """)
    Optional<OrderDetail> findCertificateItemForUser(@Param("orderDetailId") Integer orderDetailId,
                                                     @Param("userId") Integer userId);
}
