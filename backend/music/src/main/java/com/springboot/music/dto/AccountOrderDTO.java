package com.springboot.music.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountOrderDTO {

    private Integer orderId;
    private String paymentStatus;
    private String paymentMethod;
    private String gatewayTransactionCode;
    private Double totalAmount;
    private LocalDateTime createdAt;
    private Integer totalItems;
    private List<AccountOrderItemDTO> items;
}

