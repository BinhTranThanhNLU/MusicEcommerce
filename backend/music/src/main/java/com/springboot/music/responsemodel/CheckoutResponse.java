package com.springboot.music.responsemodel;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutResponse {

    private Integer orderId;
    private String paymentStatus;
    private String paymentMethod;
    private String gatewayTransactionCode;
    private Integer totalItems;
    private Double totalAmount;
    private LocalDateTime createdAt;
    private String paymentUrl;
    private String message;
}

