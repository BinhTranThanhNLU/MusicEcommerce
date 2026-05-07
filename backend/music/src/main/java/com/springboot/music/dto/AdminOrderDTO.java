package com.springboot.music.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOrderDTO {

    private Integer orderId;
    private Integer userId;
    private String customerName;
    private String customerEmail;
    private Double totalAmount;
    private String paymentStatus;
    private String paymentMethod;
    private String gatewayTransactionCode;
    private LocalDateTime createdAt;
    private Integer totalItems;
}

