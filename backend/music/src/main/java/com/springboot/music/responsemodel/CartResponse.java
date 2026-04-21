package com.springboot.music.responsemodel;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private Integer cartId;
    private Integer userId;
    private List<CartItemDetailResponse> items;
    private Double totalPrice;
    private Integer totalItems;
}

