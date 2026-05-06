package com.springboot.music.repository;

import com.springboot.music.entity.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {
    @Query("SELECT o FROM OrderEntity o WHERE o.user.id = :userId AND o.paymentStatus = 'COMPLETED' ORDER BY o.createdAt DESC")
    List<OrderEntity> findCompletedOrdersByUserId(@Param("userId") Integer userId);

    @Query(value = """
            SELECT o
            FROM OrderEntity o
            WHERE o.user.id = :userId
            ORDER BY o.createdAt DESC
            """,
            countQuery = """
            SELECT COUNT(o)
            FROM OrderEntity o
            WHERE o.user.id = :userId
            """)
    Page<OrderEntity> findByUserId(@Param("userId") Integer userId, Pageable pageable);
}

