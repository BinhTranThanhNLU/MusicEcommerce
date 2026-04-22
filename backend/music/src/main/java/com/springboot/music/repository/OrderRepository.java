package com.springboot.music.repository;

import com.springboot.music.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {
    @Query("SELECT o FROM OrderEntity o WHERE o.user.id = :userId AND o.paymentStatus = 'COMPLETED' ORDER BY o.createdAt DESC")
    List<OrderEntity> findCompletedOrdersByUserId(@Param("userId") Integer userId);
}

