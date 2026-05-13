package com.springboot.music.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminTransactionDTO {
    private Integer transactionId;
    private Integer orderId;
    private LocalDateTime createdAt;
    private String customerName;
    private Double amount;
    private Double adminRevenue;
    private String paymentMethod;
    private String status;
}

