package com.springboot.music.repository;

import com.springboot.music.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    @Query("SELECT od FROM OrderDetail od WHERE od.order.user.id = :userId AND od.order.paymentStatus = 'COMPLETED' ORDER BY od.order.createdAt DESC")
    List<OrderDetail> findByUserIdAndOrderCompleted(@Param("userId") Integer userId);
}

